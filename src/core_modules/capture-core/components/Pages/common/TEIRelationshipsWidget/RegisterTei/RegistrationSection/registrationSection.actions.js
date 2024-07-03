
// @flow
import { actionCreator } from '../../../../../../actions/actions.utils';

export const actionTypes = {
    PROGRAM_CHANGE: 'RelationshipsWidget.NewRelationshipSingleEventRegisterTeiProgramChange',
    ORG_UNIT_CHANGE: 'RelationshipsWidget.NewRelationshipSingleEventRegisterTeiOrgUnitChange',
    ORG_UNIT_SEARCH_FAILED: 'RelationshipsWidget.NewRelationshipSingleEventRegisterTeiOrgUnitSearchFailed',
    PROGRAM_FILTER_CLEAR: 'RelationshipsWidget.NewRelationshipSingleEventRegisterTeiProgramFilterClear',
};

export const changeProgram = (programId: string) =>
    actionCreator(actionTypes.PROGRAM_CHANGE)({ programId });

export const changeOrgUnit = (orgUnit: ?Object, resetProgramSelection: boolean) =>
    actionCreator(actionTypes.ORG_UNIT_CHANGE)({ orgUnit, resetProgramSelection });

export const searchOrgUnitFailed = () =>
    actionCreator(actionTypes.ORG_UNIT_SEARCH_FAILED)();

export const clearProgramFilter = () =>
    actionCreator(actionTypes.PROGRAM_FILTER_CLEAR)();
