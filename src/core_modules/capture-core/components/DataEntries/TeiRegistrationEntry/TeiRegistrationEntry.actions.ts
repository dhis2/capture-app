import { actionCreator } from '../../../actions/actions.utils';

export const teiRegistrationEntryActionTypes = {
    TEI_REGISTRATION_ENTRY_INITIALISATION_START: 'StartInitForTrackedEntityTypeRegistrationForm',
};

export const startNewTeiDataEntryInitialisation = ({
    contextOrgUnitId,
    selectedScopeId,
    dataEntryId,
    formFoundation,
    formValues,
}: any) =>
    actionCreator(teiRegistrationEntryActionTypes.TEI_REGISTRATION_ENTRY_INITIALISATION_START)({
        contextOrgUnitId,
        selectedScopeId,
        dataEntryId,
        formFoundation,
        formValues,
    });
