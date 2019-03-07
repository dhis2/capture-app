// @flow
import { actionCreator } from '../../../../actions/actions.utils';

export const actionTypes = {
    INITIALIZE_REGISTER_TEI: 'InitializeRegisterTei',
};

export const initializeRegisterTei = (
    programId: ?string,
    orgUnit?: ?Object,
) => actionCreator(actionTypes.INITIALIZE_REGISTER_TEI)({ programId, orgUnit });
