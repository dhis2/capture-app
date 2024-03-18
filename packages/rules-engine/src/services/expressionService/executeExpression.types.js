// @flow
import type { Flag, RuleVariables } from '../../rulesEngine.types';
import type { D2Functions, D2FunctionConfig } from '../../d2Functions';

export type ExpressionSet = $ReadOnly<{|
    expression: string,
    expressionModuloStrings: string,
|}>;

type InternalD2FunctionConfig = $ReadOnly<{|
    name: string,
    ...D2FunctionConfig,
|}>;

export type DhisFunctionsInfo = $ReadOnly<{|
    dhisFunctionsObject: D2Functions,
    applicableDhisFunctions: Array<InternalD2FunctionConfig>,
|}>;

export type ErrorHandler = (error: string, expressionWithInjectedVariableValues: string, evaluationResult: any) => void;

export type ExecuteExpressionInput = $ReadOnly<{|
    expression: string,
    dhisFunctions: D2Functions,
    variablesHash: RuleVariables,
    flags?: Flag,
    onError: ErrorHandler,
    onVerboseLog: (expressionWithInjectedVariableValues: string, evaluationResult: any) => void,
|}>;
