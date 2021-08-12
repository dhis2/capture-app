// @flow
import { actionCreator } from '../../actions/actions.utils';

export const actionTypes = {
    START_SHOW_EDIT_EVENT_DATA_ENTRY:
        'WidgetEventEdit.StartShowEditEventDataEntry',
};

export const startShowEditEventDataEntry = () =>
    actionCreator(actionTypes.START_SHOW_EDIT_EVENT_DATA_ENTRY)();
