import { actionCreator } from '../../../../actions/actions.utils';

export const actionTypes = {
    REGISTER_TEI_INITIALIZE: 'InitializeRegisterTei',
    REGISTER_TEI_INITIALIZE_FAILED: 'InitializeRegisterTeiFailed',
};

export const initializeRegisterTei = (
    programId?: string | null,
    orgUnit?: Record<string, unknown> | null,
) => actionCreator(actionTypes.REGISTER_TEI_INITIALIZE)({ programId, orgUnit });

export const initializeRegisterTeiFailed = (errorMessage: string) =>
    actionCreator(actionTypes.REGISTER_TEI_INITIALIZE_FAILED)({ errorMessage });
