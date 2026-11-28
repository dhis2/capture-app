import { actionCreator } from '../../../actions/actions.utils';

export const enrollmentRegistrationEntryActionTypes = {
    TRACKER_PROGRAM_REGISTRATION_ENTRY_INITIALISATION_START: 'StartInitForEnrollmentRegistrationForm',
};

export const startNewEnrollmentDataEntryInitialisation = ({
    defaultOrgUnit,
    selectedScopeId,
    dataEntryId,
    formValues,
    clientValues,
    programCategory,
    firstStage,
    formFoundation,
}: {
    defaultOrgUnit: any;
    selectedScopeId: string;
    dataEntryId: string;
    formValues: any;
    clientValues: any;
    programCategory: any;
    firstStage: any;
    formFoundation: any;
}) =>
    actionCreator(enrollmentRegistrationEntryActionTypes.TRACKER_PROGRAM_REGISTRATION_ENTRY_INITIALISATION_START)({
        defaultOrgUnit,
        selectedScopeId,
        dataEntryId,
        formValues,
        clientValues,
        programCategory,
        firstStage,
        formFoundation,
    });
