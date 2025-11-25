import type { OrgUnit } from '@dhis2/rules-engine-javascript';
import { actionCreator } from '../../actions/actions.utils';

export const actionTypes = {
    START_SHOW_EDIT_EVENT_DATA_ENTRY: 'WidgetEventEdit.StartShowEditEventDataEntry',
    LOAD_EDIT_EVENT_DATA_ENTRY: 'WidgetEventEdit.LoadEditEventDataEntry',
};

export const startShowEditEventDataEntry = (orgUnit: OrgUnit, programCategory: Record<string, unknown>) =>
    actionCreator(actionTypes.START_SHOW_EDIT_EVENT_DATA_ENTRY)({ orgUnit, programCategory });

export const loadEditEventDataEntry = () =>
    actionCreator(actionTypes.LOAD_EDIT_EVENT_DATA_ENTRY)();
