// @flow
import isString from 'd2-utilizr/lib/isString';
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import type { ProgramRule, ProgramRuleAction, ProgramRuleVariable } from '@dhis2/rules-engine-javascript';
import { variableSourceTypes } from '@dhis2/rules-engine-javascript';
import { TrackerProgram, getProgramThrowIfNotFound } from '../../metaData';
import {
    getDataElementsForRulesExecution,
    getTrackedEntityAttributesForRulesExecution,
} from '../../rules';

export type CachedProgramIndicator = {
    id: string,
    code: string,
    name: string,
    displayName: string,
    description?: ?string,
    expression: string,
    filter?: ?string,
    programId: string,
    shortName: string,
    style?: ?{ color?: ?string },
};

type ValueTypeReference = { [id: string]: { valueType: string } };

type ProgramData = {|
    programId: string,
    dataElements: ValueTypeReference,
    attributes: ValueTypeReference,
|};

const staticReplacements = [
    { regExp: new RegExp('([^\\w\\d])(and)([^\\w\\d])', 'gi'), replacement: '$1&&$3' },
    { regExp: new RegExp('([^\\w\\d])(or)([^\\w\\d])', 'gi'), replacement: '$1||$3' },
    { regExp: new RegExp('V{execution_date}', 'g'), replacement: 'V{event_date}' },
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
    if (!input || (!isString(input))) {
        return input;
    }
    const trimmed = input.replace(/^[#VCAvca]{/, '').replace(/}$/, '');
    return trimmed;
}

function getDirectAddressedVariable(variableWithCurls, programData) {
    const variableName = trimVariableQualifiers(variableWithCurls);
    const variableNameParts = variableName.split('.');

    let newVariableObject: ProgramRuleVariable;

    if (variableNameParts.length === 2) {
        // This is a programstage and dataelement specification
        newVariableObject = {
            id: variableName,
            displayName: variableName,
            programRuleVariableSourceType: variableSourceTypes.DATAELEMENT_NEWEST_EVENT_PROGRAM_STAGE,
            valueType: programData.dataElements[variableNameParts[1]].valueType,
            programStageId: variableNameParts[0],
            dataElementId: variableNameParts[1],
            programId: programData.programId,
        };
    } else { // if (variableNameParts.length === 1)
        // This is an attribute
        newVariableObject = {
            id: variableName,
            displayName: variableName,
            programRuleVariableSourceType: variableSourceTypes.TEI_ATTRIBUTE,
            valueType: programData.attributes[variableNameParts[0]].valueType,
            trackedEntityAttributeId: variableNameParts[0],
            programId: programData.programId,
        };
    }
    return newVariableObject;
}

function getVariables(action, rule, programData) {
    const variablesInCondition = getVariablesFromExpression(rule.condition);
    // $FlowFixMe[incompatible-call] automated comment
    const variablesInData = getVariablesFromExpression(action.data);

    const directAddressedVariablesFromConditions = variablesInCondition.map(variableInCondition => getDirectAddressedVariable(variableInCondition, programData));
    const directAddressedVariablesFromData = variablesInData.map(variableInData => getDirectAddressedVariable(variableInData, programData));
    const variables = [...directAddressedVariablesFromConditions, ...directAddressedVariablesFromData];

    return {
        variables,
        variableObjectsCurrentExpression: directAddressedVariablesFromData,
    };
}

function isValueCountPresent(rule, action) {
    // $FlowFixMe[incompatible-use] automated comment
    return rule.condition.indexOf('V{value_count}') >= 0 || action.data.indexOf('V{value_count}') >= 0;
}

function replaceValueCount(rule, action, variableObjectsCurrentExpression) {
    let valueCountText = variableObjectsCurrentExpression.reduce((accValueCountText, variableCurrentRule, index) => {
        const currentText = `d2:count('${variableCurrentRule.displayName}')`;
        accValueCountText += index !== 0 ? ` + ${currentText}` : `${currentText}`;
        return accValueCountText;
    }, '');

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
    // $FlowFixMe[incompatible-use] automated comment
    return rule.condition.indexOf('V{zero_pos_value_count}') >= 0 || action.data.indexOf('V{zero_pos_value_count}') >= 0;
}

function replacePositiveValueCount(rule, action, variableObjectsCurrentExpression) {
    let positiveValueCountText = variableObjectsCurrentExpression.reduce((accPositiveValueCountText, variableCurrentRule, index) => {
        const currentText = `d2:countifzeropos('${variableCurrentRule.displayName}')`;
        accPositiveValueCountText += index !== 0 ? ` + ${currentText}` : `${currentText}`;
        return accPositiveValueCountText;
    }, '');

    positiveValueCountText = `(${positiveValueCountText})`;

    // Replace all occurrences of value counts in both the data and expression
    rule.condition = rule.condition.replace(new RegExp('V{zero_pos_value_count}', 'g'), positiveValueCountText);
    // $FlowFixMe[incompatible-use] automated comment
    action.data = action.data.replace(new RegExp('V{zero_pos_value_count}', 'g'), positiveValueCountText);
}

function replacePositiveValueCountIfPresent(rule, action, variableObjectsCurrentExpression) {
    const valueCountPresent = isPositiveValueCountPresent(rule, action);
    if (valueCountPresent) {
        replacePositiveValueCount(rule, action, variableObjectsCurrentExpression);
    }
}

function buildIndicatorRuleAndVariables(
    programIndicator: CachedProgramIndicator,
    programData: ProgramData,
) {
    // $FlowFixMe[prop-missing] automated comment
    const newAction: ProgramRuleAction = {
        id: programIndicator.id,
        content: programIndicator.name,
        displayContent: programIndicator.displayName,
        data: programIndicator.expression,
        programRuleActionType: 'DISPLAYKEYVALUEPAIR',
        location: 'indicators',
        style: programIndicator.style || null,
    };

    // $FlowFixMe[prop-missing] automated comment
    const newRule: ProgramRule = {
        id: programIndicator.id,
        condition: programIndicator.filter ? programIndicator.filter : 'true',
        description: programIndicator.description,
        name: programIndicator.name,
        displayName: programIndicator.displayName,
        programId: programIndicator.programId,
        programRuleActions: [newAction],
    };

    const { variables, variableObjectsCurrentExpression } = getVariables(newAction, newRule, programData);

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

export function getRulesAndVariablesFromProgramIndicators(
    cachedProgramIndicators: Array<CachedProgramIndicator>,
    programId: string,
) {
    const program = getProgramThrowIfNotFound(programId);
    const dataElements = getDataElementsForRulesExecution(program.stages);
    const attributes = (program instanceof TrackerProgram) ?
        getTrackedEntityAttributesForRulesExecution(program.attributes) : {};
    const programData = {
        programId,
        dataElements,
        attributes,
    };

    // Filter out program indicators without an expression
    const validProgramIndicators = cachedProgramIndicators.filter((indicator) => {
        if (!indicator.expression) {
            log.error(
                errorCreator('Program indicator is missing an expression and will be skipped.')(
                    {
                        method: 'getRulesAndVariablesFromProgramIndicators',
                        object: indicator,
                    },
                ),
            );
            return false;
        }
        return true;
    });

    return validProgramIndicators
        .map(programIndicator => buildIndicatorRuleAndVariables(programIndicator, programData))
        .filter(container => container)
        .reduce((accOneLevelContainer, container) => {
            // $FlowFixMe[incompatible-type] automated comment
            accOneLevelContainer.rules = accOneLevelContainer.rules || [];
            // $FlowFixMe[incompatible-use] automated comment
            accOneLevelContainer.rules.push(container.rule);

            // $FlowFixMe[incompatible-type] automated comment
            // $FlowFixMe[incompatible-use] automated comment
            accOneLevelContainer.variables = accOneLevelContainer.variables ? [...accOneLevelContainer.variables, ...container.variables] : container.variables;
            return accOneLevelContainer;
        }, { rules: null, variables: null });
}
