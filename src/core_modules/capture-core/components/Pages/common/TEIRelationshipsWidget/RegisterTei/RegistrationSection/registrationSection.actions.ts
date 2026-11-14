import { actionCreator } from '../../../../../../actions/actions.utils';

export const actionTypes = {
    PROGRAM_CHANGE: 'RelationshipsWidget.NewRelationshipSingleEventRegisterTeiProgramChange',
    PROGRAM_FILTER_CLEAR: 'RelationshipsWidget.NewRelationshipSingleEventRegisterTeiProgramFilterClear',
};

export const changeProgram = (programId: string) =>
    actionCreator(actionTypes.PROGRAM_CHANGE)({ programId });

export const clearProgramFilter = () =>
    actionCreator(actionTypes.PROGRAM_FILTER_CLEAR)();
