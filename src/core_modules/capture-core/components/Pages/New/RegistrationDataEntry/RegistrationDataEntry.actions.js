import { actionCreator } from '../../../../actions/actions.utils';

export const registrationFormActionTypes = {
    DATA_ENTRY_INITIALISATION_START: 'Registration/StartDataEntryInitialisation',
};

export const startDataEntryInitialisation = ({ selectedOrgUnitInfo, dataEntryId, formFoundation }) =>
    actionCreator(registrationFormActionTypes.DATA_ENTRY_INITIALISATION_START)({ selectedOrgUnitInfo, dataEntryId, formFoundation });
