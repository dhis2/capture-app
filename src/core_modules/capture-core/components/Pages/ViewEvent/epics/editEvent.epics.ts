import { ofType } from 'redux-observable';
import { map } from 'rxjs/operators';
import {
    actionTypes as editEventActionTypes,
} from '../../../WidgetEventEdit/EditEventDataEntry/editEventDataEntry.actions';

export const editEventEpic = (action$: any) =>
    action$.pipe(
        ofType(editEventActionTypes.REQUEST_SAVE_EDIT_EVENT_DATA_ENTRY),
        map(() => ({ type: 'EDIT_EVENT_FIELD_UPDATED' })),
    );
