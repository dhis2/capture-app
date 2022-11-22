// @flow
import { actionCreator } from '../../../actions/actions.utils';

export const teiRegistrationEntryActionTypes = {
    TEI_REGISTRATION_ENTRY_INITIALISATION_START: 'StartInitForTrackedEntityTypeRegistrationForm',
};

export const startNewTeiDataEntryInitialisation = ({ selectedOrgUnitId, selectedScopeId, dataEntryId, formFoundation, formValues }: Object) =>
    actionCreator(teiRegistrationEntryActionTypes.TEI_REGISTRATION_ENTRY_INITIALISATION_START)({ selectedOrgUnitId, selectedScopeId, dataEntryId, formFoundation, formValues });
