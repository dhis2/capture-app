
// @flow
import { actionCreator } from '../../../../../actions/actions.utils';

export const actionTypes = {
    PROGRAM_CHANGE: 'NewRelationshipSingleEventRegisterTeiProgramChange',
    ORG_UNIT_CHANGE: 'NewRelationshipSingleEventRegisterTeiOrgUnitChange',
    ORG_UNIT_SEARCH_FAILED: 'NewRelationshipSingleEventRegisterTeiOrgUnitSearchFailed',
    PROGRAM_FILTER_CLEAR: 'ProgramFilterClear',
};

export const changeProgram = (programId: string) =>
    actionCreator(actionTypes.PROGRAM_CHANGE)({ programId });

export const changeOrgUnit = (orgUnit: ?Object) =>
    actionCreator(actionTypes.ORG_UNIT_CHANGE)({ orgUnit });

export const searchOrgUnitFailed = () =>
    actionCreator(actionTypes.ORG_UNIT_SEARCH_FAILED)();

export const clearProgramFilter = () =>
    actionCreator(actionTypes.PROGRAM_FILTER_CLEAR)();
