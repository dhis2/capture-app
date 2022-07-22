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
