// @flow
import { actionCreator } from '../../../actions/actions.utils';

export const enrollmentRegistrationEntryActionTypes = {
    TRACKER_PROGRAM_REGISTRATION_ENTRY_INITIALISATION_START: 'StartInitForEnrollmentRegistrationForm',
};

export const startNewEnrollmentDataEntryInitialisation = ({
    selectedOrgUnit,
    selectedScopeId,
    dataEntryId,
    formValues,
    clientValues,
    programCategory,
    firstStage,
    formFoundation,
}: Object) =>
    actionCreator(enrollmentRegistrationEntryActionTypes.TRACKER_PROGRAM_REGISTRATION_ENTRY_INITIALISATION_START)({
        selectedOrgUnit,
        selectedScopeId,
        dataEntryId,
        formValues,
        clientValues,
        programCategory,
        firstStage,
        formFoundation,
    });
