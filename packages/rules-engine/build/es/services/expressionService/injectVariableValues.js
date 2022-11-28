import log from 'loglevel';
import { getInjectionValue } from './common';

const logWarnMessage = (expr, variablePresent) => {
  log.warn("Expression ".concat(expr, " contains context variable ").concat(variablePresent, " \n- but this variable is not defined."));
};

const preprocessD2FunctionArguments = expression => {
  /*
      We will skip value injections for the arguments of the following d2 functions.
      These functions will grab data directly from the variableHash (inside the d2 function).
      The pre/suf-fix for the arguments will be removed (only the variable names will remain)
      and will therefore not match the replacement patterns when injecting values later.
  */
  const nonInjectingFunctions = ['d2:hasValue', 'd2:lastEventDate', 'd2:count', 'd2:countIfZeroPos', 'd2:countIfValue'];
  const d2FunctionMatcherExpression = new RegExp("(".concat(nonInjectingFunctions.join('|'), ")\\( *([A#CV]{[\\w -_]+})( *, *(([\\d/\\*\\+\\-%. ]+)|'[^']*'|\"[^\"]*\"))* *\\)"), 'g');
  const d2FunctionMatches = expression.match(d2FunctionMatcherExpression) || [];
  return d2FunctionMatches.reduce((accExpression, match) => {
    const processedMatch = match // lgtm [js/incomplete-sanitization]
    .replace('#{', "'").replace('A{', "'").replace('C{', "'").replace('V{', "'").replace('}', "'");
    return accExpression.replace(match, processedMatch);
  }, expression);
};

export const injectVariableValues = (rawExpression, variablesHash) => {
  if (!rawExpression.includes('{')) {
    return rawExpression;
  }

  const expression = preprocessD2FunctionArguments(rawExpression);

  if (!expression.includes('{')) {
    return expression;
  } // Find every variable reference in the expression


  const variableMatches = expression.match(/[A#CV]\{[\w -_]+}/g) || []; // Inject the value for each matched variable

  return variableMatches.reduce((accExpression, variableMatch) => {
    // Remove pre/suf-fix to get the variable name for the variableHash
    const variableName = variableMatch // lgtm [js/incomplete-sanitization]
    .replace('#{', '').replace('A{', '').replace('C{', '').replace('V{', '').replace('}', '');
    const variable = variablesHash[variableName];

    if (!variable) {
      logWarnMessage(accExpression, variableName);
      return accExpression.replace(variableMatch, getInjectionValue(''));
    }

    return accExpression.replace(variableMatch, getInjectionValue(variable.variableValue));
  }, expression);
};