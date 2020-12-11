// @flow
import isString from 'd2-utilizr/lib/isString';

import type { ProgramRule, ProgramRuleAction, ProgramRuleVariable } from '../../rules/engine';

export type CachedProgramIndicator = {
  id: string,
  code: string,
  displayInForm: boolean,
  displayName: string,
  description?: ?string,
  expression: string,
  filter?: ?string,
  programId: string,
  shortName: string,
};

const staticReplacements = [
  {
    regExp: new RegExp('([^\\w\\d])(and)([^\\w\\d])', 'gi'),
    replacement: '$1&&$3',
  },
  {
    regExp: new RegExp('([^\\w\\d])(or)([^\\w\\d])', 'gi'),
    replacement: '$1||$3',
  },
  {
    regExp: new RegExp('V{execution_date}', 'g'),
    replacement: 'V{event_date}',
  },
];

function performStaticReplacements(expression: string) {
  return staticReplacements.reduce((accExpression, staticReplacement) => {
    accExpression = accExpression.replace(staticReplacement.regExp, staticReplacement.replacement);
    return accExpression;
  }, expression);
}

function getVariablesFromExpression(data: string) {
  return data.match(/[A#]{\w+.?\w*}/g) || [];
}

function trimVariableQualifiers(input) {
  if (!input || !isString(input)) {
    return input;
  }
  const trimmed = input.replace(/^[#VCAvca]{/, '').replace(/}$/, '');
  return trimmed;
}

function getDirectAddressedVariable(variableWithCurls, programId) {
  const variableName = trimVariableQualifiers(variableWithCurls);
  const variableNameParts = variableName.split('.');

  let newVariableObject: ProgramRuleVariable;

  if (variableNameParts.length === 2) {
    // This is a programstage and dataelement specification
    newVariableObject = {
      id: variableName,
      displayName: variableName,
      programRuleVariableSourceType: 'DATAELEMENT_CURRENT_EVENT',
      dataElementId: variableNameParts[1],
      programId,
    };
  } else {
    // if (variableNameParts.length === 1)
    // This is an attribute
    newVariableObject = {
      id: variableName,
      displayName: variableName,
      programRuleVariableSourceType: 'TEI_ATTRIBUTE',
      trackedEntityAttributeId: variableNameParts[0],
      programId,
    };
  }
  return newVariableObject;
}

function getVariables(action, rule, programId) {
  const variablesInCondition = getVariablesFromExpression(rule.condition);
  // $FlowFixMe[incompatible-call] automated comment
  const variablesInData = getVariablesFromExpression(action.data);

  const directAddressedVariablesFromConditions = variablesInCondition.map((variableInCondition) =>
    getDirectAddressedVariable(variableInCondition, programId),
  );
  const directAddressedVariablesFromData = variablesInData.map((variableInData) =>
    getDirectAddressedVariable(variableInData, programId),
  );
  const variables = [
    ...directAddressedVariablesFromConditions,
    ...directAddressedVariablesFromData,
  ];

  return {
    variables,
    variableObjectsCurrentExpression: directAddressedVariablesFromData,
  };
}

function isValueCountPresent(rule, action) {
  return (
    // $FlowFixMe[incompatible-use] automated comment
    rule.condition.indexOf('V{value_count}') >= 0 || action.data.indexOf('V{value_count}') >= 0
  );
}

function replaceValueCount(rule, action, variableObjectsCurrentExpression) {
  let valueCountText = variableObjectsCurrentExpression.reduce(
    (accValueCountText, variableCurrentRule, index) => {
      const currentText = `d2:count('${variableCurrentRule.displayName}')`;
      accValueCountText += index !== 0 ? ` + ${currentText}` : `${currentText}`;
      return accValueCountText;
    },
    '',
  );

  valueCountText = `(${valueCountText})`;

  // Replace all occurrences of value counts in both the data and expression
  rule.condition = rule.condition.replace(new RegExp('V{value_count}', 'g'), valueCountText);
  // $FlowFixMe[incompatible-use] automated comment
  action.data = action.data.replace(new RegExp('V{value_count}', 'g'), valueCountText);

  return { rule, action };
}

function replaceValueCountIfPresent(rule, action, variableObjectsCurrentExpression) {
  const valueCountPresent = isValueCountPresent(rule, action);
  if (valueCountPresent) {
    replaceValueCount(rule, action, variableObjectsCurrentExpression);
  }
}

function isPositiveValueCountPresent(rule, action) {
  return (
    rule.condition.indexOf('V{zero_pos_value_count}') >= 0 ||
    // $FlowFixMe[incompatible-use] automated comment
    action.data.indexOf('V{zero_pos_value_count}') >= 0
  );
}

function replacePositiveValueCount(rule, action, variableObjectsCurrentExpression) {
  let positiveValueCountText = variableObjectsCurrentExpression.reduce(
    (accPositiveValueCountText, variableCurrentRule, index) => {
      const currentText = `d2:countifzeropos('${variableCurrentRule.displayName}')`;
      accPositiveValueCountText += index !== 0 ? ` + ${currentText}` : `${currentText}`;
      return accPositiveValueCountText;
    },
    '',
  );

  positiveValueCountText = `(${positiveValueCountText})`;

  // Replace all occurrences of value counts in both the data and expression
  rule.condition = rule.condition.replace(
    new RegExp('V{zero_pos_value_count}', 'g'),
    positiveValueCountText,
  );
  // $FlowFixMe[incompatible-use] automated comment
  action.data = action.data.replace(
    new RegExp('V{zero_pos_value_count}', 'g'),
    positiveValueCountText,
  );
}

function replacePositiveValueCountIfPresent(rule, action, variableObjectsCurrentExpression) {
  const valueCountPresent = isPositiveValueCountPresent(rule, action);
  if (valueCountPresent) {
    replacePositiveValueCount(rule, action, variableObjectsCurrentExpression);
  }
}

function buildIndicatorRuleAndVariables(
  programIndicator: CachedProgramIndicator,
  programId: string,
) {
  if (!programIndicator.displayInForm) {
    return null;
  }

  // $FlowFixMe[prop-missing] automated comment
  const newAction: ProgramRuleAction = {
    id: programIndicator.id,
    content: programIndicator.shortName || programIndicator.displayName,
    data: programIndicator.expression,
    programRuleActionType: 'DISPLAYKEYVALUEPAIR',
    location: 'indicators',
  };

  // $FlowFixMe[prop-missing] automated comment
  const newRule: ProgramRule = {
    id: programIndicator.id,
    condition: programIndicator.filter ? programIndicator.filter : 'true',
    description: programIndicator.description,
    displayName: programIndicator.displayName,
    programId: programIndicator.programId,
    programRuleActions: [newAction],
  };

  const { variables, variableObjectsCurrentExpression } = getVariables(
    newAction,
    newRule,
    programId,
  );

  // Change expression or data part of the rule to match the program rules execution model
  replaceValueCountIfPresent(newRule, newAction, variableObjectsCurrentExpression);
  replacePositiveValueCountIfPresent(newRule, newAction, variableObjectsCurrentExpression);

  // $FlowFixMe[incompatible-call] automated comment
  newAction.data = performStaticReplacements(newAction.data);
  newRule.condition = performStaticReplacements(newRule.condition);

  return {
    rule: newRule,
    variables,
  };
}

export default function getRulesAndVariablesFromProgramIndicators(
  cachedProgramIndicators: Array<CachedProgramIndicator>,
  programId: string,
) {
  return cachedProgramIndicators
    .map((programIndicator) => buildIndicatorRuleAndVariables(programIndicator, programId))
    .filter((container) => container)
    .reduce(
      (accOneLevelContainer, container) => {
        // $FlowFixMe[incompatible-type] automated comment
        accOneLevelContainer.rules = accOneLevelContainer.rules || [];
        // $FlowFixMe[incompatible-use] automated comment
        accOneLevelContainer.rules.push(container.rule);

        accOneLevelContainer.variables = accOneLevelContainer.variables
          // $FlowFixMe[incompatible-use] automated comment
          ? [...accOneLevelContainer.variables, ...container.variables]
          // $FlowFixMe[incompatible-type] automated comment
          // $FlowFixMe[incompatible-use] automated comment
          : container.variables;
        return accOneLevelContainer;
      },
      { rules: null, variables: null },
    );
}
