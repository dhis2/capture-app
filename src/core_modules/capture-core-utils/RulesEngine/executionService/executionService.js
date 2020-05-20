// @flow
import isDefined from 'd2-utilizr/lib/isDefined';
import type { D2Functions } from '../rulesEngine.types';

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
const isFunctionSignatureBroken = (dhisFunctionParameters: ?number, parameters: Array<any>) => {
    if (dhisFunctionParameters) {
        // But we are only checking parameters where the dhisFunction actually has
        // a defined set of parameters(concatenate, for example, does not have a fixed number);
        const numParameters = parameters.length || 0;

        return numParameters !== dhisFunctionParameters;
    }
    return false;
};

const executeExpression = (dhisFunctions: D2Functions, expression: string, logError: any) => {
    const dhisFunctionWhenNameIncludedOnExpression = ({ name }) => expression.includes(name);
    const onExpressionReplaceFunctionCallStringWithEvaluatedString =
      ({ evaluatedExpression, isUpdated }, { name, dhisFunction, parameters }) => {
          // Select the function call, with any number of parameters inside single quotations, or number parameters without quotations
          const regularExFunctionCall = new RegExp(`${name}\\( *(([\\d/\\*\\+\\-%. ]+)|( *'[^']*'))*( *, *(([\\d/\\*\\+\\-%. ]+)|'[^']*'))* *\\)`, 'g');
          const callsToThisFunction = evaluatedExpression.match(regularExFunctionCall);

          if (Array.isArray(callsToThisFunction)) {
              callsToThisFunction.forEach((callToThisFunction) => {
                  const evaluatedParameters = callToThisFunction
                  // Remove the function name and parenthesis:
                      .replace(/(^[^(]+\()|\)$/g, '')
                  // Remove white spaces before and after parameters:
                      .trim()
                  // Then split into single parameters:
                      .match(/(('[^']+')|([^,]+))/g)
                  // In case the function call is nested, the parameter itself contains an expression, run the expression.
                      .map(param => executeExpression(dhisFunctions, param, logError));

                  if (isFunctionSignatureBroken(parameters, evaluatedParameters)) {
                      logError && logError('Error: Signature params have not the same dimensions');
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
                const { evaluatedExpression, isUpdated } =
                  // https://github.com/facebook/flow/issues/2221
                  (Object.values(dhisFunctions): any)
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

export default executeExpression;
