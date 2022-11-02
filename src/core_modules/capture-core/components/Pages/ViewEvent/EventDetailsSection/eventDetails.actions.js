// @flow
import type { OrgUnit } from 'rules-engine';
import { actionCreator } from '../../../../actions/actions.utils';

export const actionTypes = {
    START_SHOW_EDIT_EVENT_DATA_ENTRY: 'StartShowEditEventDataEntryForViewSingleEvent',
    SHOW_EDIT_EVENT_DATA_ENTRY: 'ShowEditEventDataEntryForViewSingleEvent',
};


export const startShowEditEventDataEntry = (orgUnit: OrgUnit) =>
    actionCreator(actionTypes.START_SHOW_EDIT_EVENT_DATA_ENTRY)({ orgUnit });

export const showEditEventDataEntry = () =>
    actionCreator(actionTypes.SHOW_EDIT_EVENT_DATA_ENTRY)();
