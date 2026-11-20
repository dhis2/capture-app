import { actionCreator } from '../../../../../actions/actions.utils';

export const actionTypes = {
    PROGRAM_CHANGE: 'NewRelationshipSingleEventRegisterTeiProgramChange',
};

export const changeProgram = (programId: string) =>
    actionCreator(actionTypes.PROGRAM_CHANGE)({ programId });
