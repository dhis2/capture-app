import { actionCreator } from '../../../../../actions/actions.utils';

export const actionTypes = {
    INITIALIZE_REGISTER_TEI: 'InitializeRegisterTei',
    INITIALIZE_REGISTER_TEI_FAILED: 'InitializeRegisterTeiFailed',
};

export const initializeRegisterTei = (programId: string | null, orgUnit?: any) =>
    actionCreator(actionTypes.INITIALIZE_REGISTER_TEI)({ programId, orgUnit });

export const initializeRegisterTeiFailed = (error: any) =>
    actionCreator(actionTypes.INITIALIZE_REGISTER_TEI_FAILED)({ error });
