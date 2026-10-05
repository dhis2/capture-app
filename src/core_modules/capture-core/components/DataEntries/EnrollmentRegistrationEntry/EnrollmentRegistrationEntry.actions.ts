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
}: {
    selectedOrgUnit: any;
    selectedScopeId: string;
    dataEntryId: string;
    formValues: any;
    clientValues: any;
    programCategory: any;
    firstStage: any;
    formFoundation: any;
}) =>
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
