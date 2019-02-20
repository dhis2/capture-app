// @flow
import { actionCreator } from '../../../../actions/actions.utils';

export const actionTypes = {
    INITIALIZE_REGISTER_TEI: 'InitializeRegisterTei',
};

export const initializeRegisterTei = (
    programId: string,
    orgUnitId: string,
) => actionCreator(actionTypes.INITIALIZE_REGISTER_TEI)({ programId, orgUnitId });
