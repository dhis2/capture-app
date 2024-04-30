// @flow
import type {
    RuleVariables,
    IDateUtils,
    OrgUnit,
} from '../rulesEngine.types';

export type D2FunctionsInput = $ReadOnly<{|
    dateUtils: IDateUtils,
    variablesHash: RuleVariables,
    selectedOrgUnit: OrgUnit,
    selectedUserRoles: Array<string>,
|}>;

type D2ParameterRange = {|
    min: number,
    max: number,
|}

export type D2Parameters = number | D2ParameterRange;

export type D2FunctionConfig = {|
    parameters?: D2Parameters,
    execute: (params: Array<any>) => any,
|}
export type D2Functions = $ReadOnly<{|
    ceil: D2FunctionConfig,
    floor: D2FunctionConfig,
    round: D2FunctionConfig,
    modulus: D2FunctionConfig,
    zing: D2FunctionConfig,
    oizp: D2FunctionConfig,
    concatenate: D2FunctionConfig,
    daysBetween: D2FunctionConfig,
    weeksBetween: D2FunctionConfig,
    monthsBetween: D2FunctionConfig,
    yearsBetween: D2FunctionConfig,
    addDays: D2FunctionConfig,
    count: D2FunctionConfig,
    countIfValue: D2FunctionConfig,
    countIfZeroPos: D2FunctionConfig,
    hasValue: D2FunctionConfig,
    validatePattern: D2FunctionConfig,
    left: D2FunctionConfig,
    right: D2FunctionConfig,
    substring: D2FunctionConfig,
    split: D2FunctionConfig,
    length: D2FunctionConfig,
    inOrgUnitGroup: D2FunctionConfig,
    hasUserRole: D2FunctionConfig,
    zScoreWFA: D2FunctionConfig,
    zScoreHFA: D2FunctionConfig,
    zScoreWFH: D2FunctionConfig,
    extractDataMatrixValue: D2FunctionConfig,
    lastEventDate: D2FunctionConfig,
    addControlDigits: D2FunctionConfig,
    checkControlDigits: D2FunctionConfig,
    multiTextContains: D2FunctionConfig,
    condition: D2FunctionConfig,
|}>;
