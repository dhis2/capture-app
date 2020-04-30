import log from 'loglevel';
import isDefined from 'd2-utilizr/lib/isDefined';
import isString from 'd2-utilizr/lib/isString';
import trimQuotes from '../commonUtils/trimQuotes';
import typeKeys from '../typeKeys.const';
import getRulesEffectsProcessor from '../rulesEffectsProcessor/rulesEffectsProcessor';
import effectActions from '../effectActions.const';

/**
 * Creates a function with closed scope where the given string can be executed as javascript
 * @param code
 * @returns {*}
 */
function evaluate(code) {
    // eslint-disable-next-line no-new-func
    const func = new Function(`"use strict";return ${code}`);
    return func();
}

/**
 * replaces the variables in an expression with actual variable values.
 * @param expression
 * @param variablesHash
 * @returns {*}
 */
const replaceVariablesWithValues = (expression, variablesHash) => {
    const warnMessage = (expr, variablePresent) => {
        log.warn(`Expression ${expr} contains context variable ${variablePresent} 
    - but this variable is not defined.`);
    };


    if (expression.includes('{') === false) {
        return expression;
    }
    // Check if the expression contains program rule variables at all(any curly braces):
    if (expression.indexOf('{') !== -1) {
        // Find every variable name in the expression;
        const variablesPresent = expression.match(/[A#CV]\{[\w -_.]+}/g);
        // Replace each matched variable:
        variablesPresent.forEach((variablePresent) => {
            // First strip away any prefix and postfix signs from the variable name:
            variablePresent = variablePresent
                .replace('#{', '')
                .replace('A{', '')
                .replace('C{', '')
                .replace('V{', '')
                .replace('}', '');

            if (isDefined(variablesHash[variablePresent])) {
                // Replace all occurrences of the variable name(hence using regex replacement):
                expression = expression
                    .replace(
                        new RegExp(`${variablesHash[variablePresent].variablePrefix}\\{${variablePresent}\\}`, 'g'),
                        variablesHash[variablePresent].variableValue,
                    );
            } else {
                warnMessage(expression, variablePresent);
            }
        });
    }

    // todo this can an abstraction or this is most likely can be removed since the previous if statement is doing what all the rest if statements claim to do.
    // QUESTION when is it actually coming in this V{ ??

    // Check if the expression contains environment  variables
    if (expression.indexOf('V{') !== -1) {
        // Find every variable name in the expression;
        const variablesPresent = expression.match(/V{\w+.?\w*}/g);
        // Replace each matched variable:
        variablesPresent.forEach((variablePresent) => {
            // First strip away any prefix and postfix signs from the variable name:
            variablePresent = variablePresent.replace('V{', '').replace('}', '');

            if (isDefined(variablesHash[variablePresent]) && variablesHash[variablePresent].variablePrefix === 'V') {
                // Replace all occurrences of the variable name(hence using regex replacement):
                expression = expression
                    .replace(
                        new RegExp(`V{${variablePresent}}`, 'g'),
                        variablesHash[variablePresent].variableValue,
                    );
            } else {
                warnMessage(expression, variablePresent);
            }
        });
    }

    // Check if the expression contains attribute variables:
    if (expression.indexOf('A{') !== -1) {
        // Find every attribute in the expression;
        const variablesPresent = expression.match(/A{\w+.?\w*}/g);
        // Replace each matched variable:
        variablesPresent.forEach((variablePresent) => {
            // First strip away any prefix and postfix signs from the variable name:
            variablePresent = variablePresent.replace('A{', '').replace('}', '');

            if (isDefined(variablesHash[variablePresent]) && variablesHash[variablePresent].variablePrefix === 'A') {
                // Replace all occurrences of the variable name(hence using regex replacement):
                expression = expression
                    .replace(
                        new RegExp(`A{${variablePresent}}`, 'g'),
                        variablesHash[variablePresent].variableValue,
                    );
            } else {
                warnMessage(expression, variablePresent);
            }
        });
    }

    // Check if the expression contains constants
    if (expression.indexOf('C{') !== -1) {
        // Find every constant in the expression;
        const variablesPresent = expression.match(/C{\w+.?\w*}/g);
        // Replace each matched variable:
        variablesPresent.forEach((variablePresent) => {
            // First strip away any prefix and postfix signs from the variable name:
            variablePresent = variablePresent.replace('C{', '').replace('}', '');

            if (isDefined(variablesHash[variablePresent]) && variablesHash[variablePresent].variablePrefix === 'C') {
                // Replace all occurrences of the variable name(hence using regex replacement):
                expression = expression
                    .replace(
                        new RegExp(`C{${variablePresent}}`, 'g'),
                        variablesHash[variablePresent].variableValue,
                    );
            } else {
                warnMessage(expression, variablePresent);
            }
        });
    }

    return expression;
};

/**
 * Checks whether
 *  a) no parameters is given when a function requires parameters,
 *  b) the number of parameters given is not aligned with the function definition.
 *
 * @param dhisFunctionParameters
 * @param parameters
 * @returns {boolean}
 */
const isFunctionSignatureBroken = (dhisFunctionParameters, parameters) => {
    if (dhisFunctionParameters) {
        // But we are only checking parameters where the dhisFunction actually has
        // a defined set of parameters(concatenate, for example, does not have a fixed number);
        const numParameters = parameters.length || 0;

        return numParameters !== dhisFunctionParameters;
    }
    return false;
};

const convertRuleEffectDataToOutputBaseValue = (data, valueType) => {
    const convertNumber = (numberRepresentation) => {
        if (isString(numberRepresentation)) {
            if (isNaN(numberRepresentation)) {
                log.warn(`rule execution service could not convert ${numberRepresentation} to number`);
                return null;
            }
            return Number(numberRepresentation);
        }
        return numberRepresentation;
    };

    const ruleEffectDataConvertersByType = {
        [typeKeys.BOOLEAN]: (value) => {
            if (isString(value)) {
                return value === 'true';
            }
            return value;
        },
        [typeKeys.INTEGER]: convertNumber,
        [typeKeys.INTEGER_NEGATIVE]: convertNumber,
        [typeKeys.INTEGER_POSITIVE]: convertNumber,
        [typeKeys.INTEGER_ZERO_OR_POSITIVE]: convertNumber,
        [typeKeys.NUMBER]: convertNumber,
        [typeKeys.TRUE_ONLY]: () => true,
    };

    if (!data && data !== 0 && data !== false) {
        return null;
    }

    return ruleEffectDataConvertersByType[valueType] ? ruleEffectDataConvertersByType[valueType](data) : data;
};

/**
 * There are effects that as a result will update an existing program variable.
 * Updates of that sort in are taking place here.
 * @param effects
 * @param variablesHash
 */
function updateVariableHashWhenActionIsAssignValue(effects, variablesHash) {
    effects
        .filter(({ action, content }) => action === effectActions.ASSIGN_VALUE && content)
        .forEach(({ content, data }) => {
            const variableToAssign = content.replace('#{', '').replace('A{', '').replace('}', '');
            const variableHash = variablesHash[variableToAssign];

            if (!variableHash) {
            // If a variable is mentioned in the content of the rule, but does not exist in the variables hash, show a warning:
                log.warn(`Variable ${variableToAssign} was not defined.`);
            } else {
            // buildAssignVariable
                const { valueType } = variableHash;
                let variableValue = convertRuleEffectDataToOutputBaseValue(data, valueType);
                if (isString(variableValue)) {
                    variableValue = `'${variableValue}'`;
                }

                variablesHash[variableToAssign] = {
                    variableValue,
                    variableType: valueType,
                    hasValue: true,
                    variableEventDate: '',
                    variablePrefix: variableHash.variablePrefix || '#',
                    allValues: [variableValue],
                };
            }
        });
}


export default function getExecutionService(rulesEffectsValueConverter, dhisFunctions) {
    const runExpression = (expression, variablesHash, logError) => {
        const dhisFunctionWhenNameIncludedOnExpression = ({ name }) => expression.includes(name);
        const onExpressionReplaceFunctionCallStringWithEvaluatedString =
          ({ evaluatedExpression, isUpdated }, { name, dhisFunction, parameters }) => {
              // Select the function call, with any number of parameters inside single quotations, or number parameters without quotations
              const regularExFunctionCall = new RegExp(`${name}\\( *(([\\d/\\*\\+\\-%. ]+)|( *'[^']*'))*( *, *(([\\d/\\*\\+\\-%. ]+)|'[^']*'))* *\\)`, 'g');
              const callsToThisFunction = evaluatedExpression.match(regularExFunctionCall);

              if (callsToThisFunction) {
                  callsToThisFunction.forEach((callToThisFunction) => {
                      const evaluatedParameters = callToThisFunction
                      // Remove the function name and parenthesis:
                          .replace(/(^[^(]+\()|\)$/g, '')
                      // Remove white spaces before and after parameters:
                          .trim()
                      // Then split into single parameters:
                          .match(/(('[^']+')|([^,]+))/g)
                      // In case the function call is nested, the parameter itself contains an expression, run the expression.
                      // todo add logError
                          .map(param => runExpression(param, variablesHash));

                      if (isFunctionSignatureBroken(parameters, evaluatedParameters)) {
                          log.warn(`${name} was called with the incorrect number of parameters`);
                          // Function call is not possible to evaluate, remove the call:
                          evaluatedExpression = evaluatedExpression.replace(callToThisFunction, 'false');
                      } else {
                          const dhisFunctionEvaluation = dhisFunction(evaluatedParameters);
                          evaluatedExpression = evaluatedExpression.replace(callToThisFunction, dhisFunctionEvaluation);
                      }

                      isUpdated = true;
                  });
              }
              return { evaluatedExpression, isUpdated };
          };

        let answer = false;
        try {
            if (isDefined(expression) && expression.includes('d2:')) {
                let continueLooping = true;
                // Safety harness on 10 loops, in case of unanticipated syntax causing unintencontinued looping
                for (let i = 0; i < 10 && continueLooping; i++) {
                    const { evaluatedExpression, isUpdated } = Object.values(dhisFunctions)
                        .filter(dhisFunctionWhenNameIncludedOnExpression)
                        .reduce(
                            onExpressionReplaceFunctionCallStringWithEvaluatedString,
                            { evaluatedExpression: expression, isUpdated: false },
                        );

                    expression = evaluatedExpression;
                    // We only want to continue looping until we made a successful replacement,
                    // and there is still occurrences of "d2:" in the code. In cases where d2: occur outside
                    // the expected d2: function calls, one unneccesary iteration will be done and the
                    // successfulExecution will be false coming back here, ending the loop. The last iteration
                    // should be zero to marginal performancewise.
                    continueLooping = isUpdated && expression.indexOf('d2:') !== -1;
                }
            }

            answer = evaluate(expression);
        } catch (e) {
            logError && logError(e);
        }
        return answer;
    };


    /**
     *
     * @param {*} programRules all program rules for the program
     * @param {*} dataElements all data elements(metadata)
     * @param {*} trackedEntityAttributes all tracked entity attributes(metadata)
     * @param {*} variablesHash is a table hash with all the variables that have rules attached to it
     * @param {*} processType is either TEI or EVENT
     * @param {*} flag execution flags
     */
    function getEffects(
        programRules,
        dataElements,
        trackedEntityAttributes,
        variablesHash,
        processType,
        flag = { debug: false },
    ) {
        if (!programRules) {
            return null;
        }

        const effects = programRules
            .sort((a, b) => {
                if (!a.priority && !b.priority) {
                    return 0;
                }

            if (!a.priority) {
                return 1;
            }

            if (!b.priority) {
                return -1;
            }

                return a.priority - b.priority;
            })
            .map((rule) => {
                let isRuleEffective = false;
                const { condition: expression } = rule;
                if (expression) {
                    const strippedExpression = replaceVariablesWithValues(expression, variablesHash);
                    // checks if the rule is effective meaning that the rule results to a truthy expression
                    isRuleEffective = runExpression(strippedExpression, variablesHash, e => log.warn(`Expression with id rule:${rule.id} could not be run. Original condition was: ${rule.condition} - Evaluation ended up as:${expression} - error message:${e}`));
                } else {
                    log.warn(`Rule id:'${rule.id}'' and name:'${rule.name}' had no condition specified. Please check rule configuration.`);
                }
                return { isRuleEffective, rule };
            })
            .filter(({ isRuleEffective }) => isRuleEffective)
            .flatMap(({ rule }) => rule.programRuleActions.map((
                {
                    data: actionData,
                    programRuleActionType: action,
                    id,
                    location,
                    dataElementId,
                    trackedEntityAttributeId,
                    programStageId,
                    programStageSectionId,
                    optionGroupId,
                    optionId,
                    content,
                }) => {
                let ruleEffectData;
                if (actionData) {
                    const strippedExpression = replaceVariablesWithValues(actionData, variablesHash);
                    const evaluatedRuleEffectData = runExpression(strippedExpression, variablesHash, e => log.warn(`Expression with id rule: action:${id} could not be run. Original condition was: ${rule.condition} - Evaluation ended up as:${strippedExpression} - error message:${e}`));
                    ruleEffectData = trimQuotes(evaluatedRuleEffectData);
                }
                return {
                    data: ruleEffectData,
                    id,
                    location,
                    action,
                    dataElementId,
                    trackedEntityAttributeId,
                    programStageId,
                    programStageSectionId,
                    optionGroupId,
                    optionId,
                    content,
                };
            }));

        updateVariableHashWhenActionIsAssignValue(effects, variablesHash);

    return { getEffects,  convertDataToBaseOutputValue: convertRuleEffectDataToOutputBaseValue, }
}
