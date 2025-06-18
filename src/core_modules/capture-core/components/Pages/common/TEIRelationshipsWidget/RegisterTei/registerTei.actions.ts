import { actionCreator } from '../../../../../actions/actions.utils';

export const actionTypes = {
    REGISTER_TEI_INITIALIZE: 'RelationshipsWidget.InitializeRegisterTei',
    REGISTER_TEI_INITIALIZE_FAILED: 'RelationshipsWidget.InitializeRegisterTeiFailed',
};

export const initializeRegisterTei = (
    programId: string | undefined,
    orgUnit?: Record<string, any> | undefined,
) => actionCreator(actionTypes.REGISTER_TEI_INITIALIZE)({ programId, orgUnit });

export const initializeRegisterTeiFailed = (errorMessage: string) =>
    actionCreator(actionTypes.REGISTER_TEI_INITIALIZE_FAILED)({ errorMessage });
