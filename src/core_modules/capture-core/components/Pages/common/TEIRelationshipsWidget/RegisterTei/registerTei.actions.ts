import { actionCreator } from '../../../../../actions/actions.utils';

export const actionTypes = {
    REGISTER_TEI_INITIALIZE: 'RelationshipsWidget.InitializeRegisterTei',
    REGISTER_TEI_INITIALIZE_FAILED: 'RelationshipsWidget.InitializeRegisterTeiFailed',
};

export type OrgUnit = Record<string, any> | null | undefined;

export const initializeRegisterTei = (
    programId: string | null,
    orgUnit?: OrgUnit,
) => actionCreator(actionTypes.REGISTER_TEI_INITIALIZE)({ programId, orgUnit });

export const initializeRegisterTeiFailed = (errorMessage: string) =>
    actionCreator(actionTypes.REGISTER_TEI_INITIALIZE_FAILED)({ errorMessage });
