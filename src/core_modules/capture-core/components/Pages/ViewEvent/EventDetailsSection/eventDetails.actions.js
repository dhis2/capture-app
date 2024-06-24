// @flow
import type { OrgUnit } from '@dhis2/rules-engine-javascript';
import { actionCreator } from '../../../../actions/actions.utils';
import type { ProgramCategory } from '../../../WidgetEventSchedule/CategoryOptions/CategoryOptions.types';

export const actionTypes = {
    START_SHOW_EDIT_EVENT_DATA_ENTRY: 'StartShowEditEventDataEntryForViewSingleEvent',
    SHOW_EDIT_EVENT_DATA_ENTRY: 'ShowEditEventDataEntryForViewSingleEvent',
};


export const startShowEditEventDataEntry = (orgUnit: OrgUnit, programCategory: ?ProgramCategory) =>
    actionCreator(actionTypes.START_SHOW_EDIT_EVENT_DATA_ENTRY)({ orgUnit, programCategory });

export const showEditEventDataEntry = () =>
    actionCreator(actionTypes.SHOW_EDIT_EVENT_DATA_ENTRY)();
