// @flow
import { actionCreator } from '../../../actions/actions.utils';

export const actionTypes = {
    SET_PROGRAM_ID: 'setProgramId',
};

export const setProgramId =
    (programId: string) => actionCreator(actionTypes.SET_PROGRAM_ID)(programId);
