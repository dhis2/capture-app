
import { injectVariableValues } from './injectVariableValues';
import { getInjectionValue } from './common';
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
    return typeof dhisFunctionParameters === 'number' ? numParameters !== dhisFunctionParameters : numParameters < dhisFunctionParameters.min || dhisFunctionParameters.max < numParameters;
  }
  return false;
};
const extractArgumentIndexes = (expression, expressionModuloStrings, startIndexFunction) => {
  let index = expressionModuloStrings.indexOf('(', startIndexFunction) + 1;
  let argStart = index;
  let parenthesesCount = 1;
  const argIndexes = [];
  for (; index < expression.length; index += 1) {
    if (expressionModuloStrings[index] === '(') {
      parenthesesCount += 1;
    } else if (expressionModuloStrings[index] === ')') {
      parenthesesCount -= 1;
      if (parenthesesCount === 0) {
        argIndexes.push([argStart, index]);
        break;
      }
    } else if (parenthesesCount === 1 && expressionModuloStrings[index] === ',') {
      argIndexes.push([argStart, index]);
      argStart = index + 1;
    }
  }
  return {
    argIndexes,
    closingIndex: index
  };
};
const extractArguments = (expression, expressionModuloStrings, startIndexFunction) => {
  const {
    argIndexes,
    closingIndex
  } = extractArgumentIndexes(expression, expressionModuloStrings, startIndexFunction);
  return {
    args: argIndexes.map(([start, end]) => ({
      argument: expression.substring(start, end),
      argumentModuloStrings: expressionModuloStrings.substring(start, end)
    })),
    closingIndex
  };
};
const getFunctionNameFromCall = (functionCall, prefix) => functionCall.substring(prefix.length, functionCall.length - 1);
const internalExecuteExpression = ({
  dhisFunctionsObject,
  applicableDhisFunctions
}, {
  expression,
  expressionModuloStrings
}, onError) => {
  const functionNamePrefix = 'd2:';
  // Find all d2-functions appearing in the given expression
  const includedDhisFunctions = applicableDhisFunctions.filter(({
    name
  }) => expressionModuloStrings.includes(`${functionNamePrefix + name}(`));
  if (!includedDhisFunctions.length) {
    return evaluate(expression);
  }
  const includedFunctionNames = includedDhisFunctions.map(({
    name
  }) => name).join('|');
  const regularExFunctionCall = new RegExp(`\\b${functionNamePrefix}(?:${includedFunctionNames})\\(`, 'g');
  const functionCalls = [...expression.matchAll(regularExFunctionCall)];

  // Run each d2-function. d2-functions appearing in the argument list of another d2-function
  // is invoked in the recursive calls and skipped in the original loop (see next comment)
  const {
    accExpression: accExpressionWithFunctionResults,
    currentExpressionIndex: expressionIndexAfterFunctionExecution
  } = functionCalls.reduce(({
    accExpression,
    currentExpressionIndex
  }, functionCall) => {
    if (functionCall.index < currentExpressionIndex) {
      // This means the d2-function appears in the argument list of another
      // d2-function, and has therefore already been executed at this point
      return {
        accExpression,
        currentExpressionIndex
      };
    }
    accExpression += expression.substring(currentExpressionIndex, functionCall.index);
    const {
      args,
      closingIndex
    } = extractArguments(expression, expressionModuloStrings, functionCall.index);
    const evaluatedArguments = args.map(({
      argument,
      argumentModuloStrings
    }) => internalExecuteExpression({
      dhisFunctionsObject,
      applicableDhisFunctions: includedDhisFunctions
    }, {
      expression: argument,
      expressionModuloStrings: argumentModuloStrings
    }, onError));
    const functionName = getFunctionNameFromCall(functionCall[0], functionNamePrefix);
    const dhisFunction = dhisFunctionsObject[functionName];
    if (isFunctionSignatureBroken(dhisFunction.parameters, evaluatedArguments)) {
      onError(`${functionName} was not passed valid arguments`, expression);
      // Function call is not possible to evaluate, remove the call
      accExpression += 'false';
    } else {
      const dhisFunctionResult = dhisFunction.execute(evaluatedArguments);
      accExpression += getInjectionValue(dhisFunctionResult);
    }
    return {
      accExpression,
      currentExpressionIndex: closingIndex + 1
    };
  }, {
    accExpression: '',
    currentExpressionIndex: 0
  });
  const expressionToEvaluate = accExpressionWithFunctionResults + expression.substring(expressionIndexAfterFunctionExecution, expression.length);
  return evaluate(expressionToEvaluate);
};
export const executeExpression = ({
  expression,
  dhisFunctions,
  variablesHash,
  onError
}) => {
  const expressionWithInjectedVariableValues = injectVariableValues(expression, variablesHash);
  let answer = false;
  try {
    const expressionModuloStrings = expressionWithInjectedVariableValues.replace(/'[^']*'|"[^"]*"/g, match => ' '.repeat(match.length));
    const applicableDhisFunctions = Object.entries(dhisFunctions).map(([key, value]) => ({
      ...value,
      name: key
    }));
    answer = internalExecuteExpression({
      dhisFunctionsObject: dhisFunctions,
      applicableDhisFunctions
    }, {
      expression: expressionWithInjectedVariableValues,
      expressionModuloStrings
    }, onError);
  } catch (error) {
    onError(error.message, expressionWithInjectedVariableValues);
  }
  return answer;
};