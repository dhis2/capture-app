// @flow
import { actionCreator } from '../../../actions/actions.utils';

export const enrollmentRegistrationEntryActionTypes = {
    TRACKER_PROGRAM_REGISTRATION_ENTRY_INITIALISATION_START: 'StartInitForEnrollmentRegistrationForm',
};

export const startNewEnrollmentDataEntryInitialisation = ({ selectedOrgUnitInfo, selectedScopeId, dataEntryId, formFoundation }: Object) =>
    actionCreator(enrollmentRegistrationEntryActionTypes.TRACKER_PROGRAM_REGISTRATION_ENTRY_INITIALISATION_START)({ selectedOrgUnitInfo, selectedScopeId, dataEntryId, formFoundation });

