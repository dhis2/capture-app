// @flow
import { actionCreator } from '../../../actions/actions.utils';

export const teiRegistrationEntryActionTypes = {
    TEI_REGISTRATION_ENTRY_INITIALISATION_START: 'StartInitForTrackedEntityTypeRegistrationForm',
};

export const startNewTeiDataEntryInitialisation = ({ orgUnit, selectedScopeId, dataEntryId, formFoundation }: Object) =>
    actionCreator(teiRegistrationEntryActionTypes.TEI_REGISTRATION_ENTRY_INITIALISATION_START)({
        orgUnit,
        selectedScopeId,
        dataEntryId,
        formFoundation,
    });
