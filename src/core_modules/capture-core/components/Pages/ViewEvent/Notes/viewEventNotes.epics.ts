import { ofType } from 'redux-observable';
import { switchMap } from 'rxjs/operators';
import { batchActions } from 'redux-batched-actions';
import {
    actionTypes as viewEventActionTypes,
} from '../ViewEventComponent/viewEvent.actions';
import {
    batchActionTypes as viewEventNotesBatchActionTypes,
    eventNotesLoaded,
} from './viewEventNotes.actions';
import { setNotes } from '../../../Notes/notes.actions';

const notesKey = 'viewEvent';

export const loadNotesForViewEventEpic = (
    action$: any,
    _: any,
    { querySingleResource }: any,
) =>
    action$.pipe(
        ofType(
            viewEventActionTypes.ORG_UNIT_RETRIEVED_ON_URL_UPDATE,
            viewEventActionTypes.ORG_UNIT_RETRIEVAL_FAILED_ON_URL_UPDATE,
            viewEventActionTypes.START_OPEN_EVENT_FOR_VIEW,
        ),
        switchMap((action: any) => {
            const event = action.payload.eventContainer.event;
            const eventId = event.eventId;
            return querySingleResource({
                resource: `events/${eventId}/notes`,
                params: {
                    fields: 'note,storedDate,storedBy',
                    order: 'storedDate:desc',
                },
            })
                .then((response: any) => batchActions([
                    eventNotesLoaded(),
                    setNotes(notesKey, response.notes || []),
                ], viewEventNotesBatchActionTypes.LOAD_EVENT_NOTES_BATCH))
                .catch(() => batchActions([
                    eventNotesLoaded(),
                    setNotes(notesKey, []),
                ], viewEventNotesBatchActionTypes.LOAD_EVENT_NOTES_BATCH));
        }));
