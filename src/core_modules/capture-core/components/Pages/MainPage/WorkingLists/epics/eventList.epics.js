// @flow
import { from } from 'rxjs';
import { ofType } from 'redux-observable';
import { takeUntil, filter, concatMap } from 'rxjs/operators';
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { actionTypes, deleteEventError, deleteEventSuccess } from '../workingLists.actions';
import { actionTypes as eventListActionTypes } from '../../EventsList';
import { initEventWorkingListAsync } from './initEventWorkingList';
import { updateEventWorkingListAsync } from './updateEventWorkingList';
import { getApi } from '../../../../../d2';

export const initEventListEpic = (action$: InputObservable, store: ReduxStore) =>
  action$.pipe(
    ofType(actionTypes.EVENT_LIST_INIT),
    concatMap((action) => {
      const state = store.value;
      const { programId, orgUnitId, categories } = state.currentSelections;
      const { lastTransaction } = state.offline;
      const { selectedTemplate, defaultConfig, listId } = action.payload;
      const eventQueryCriteria =
        selectedTemplate.nextEventQueryCriteria || selectedTemplate.eventQueryCriteria;
      const initialPromise = initEventWorkingListAsync(eventQueryCriteria, {
        commonQueryData: {
          programId,
          orgUnitId,
          categories,
        },
        defaultSpecification: defaultConfig,
        listId,
        lastTransaction,
      });
      return from(initialPromise).pipe(
        takeUntil(
          action$.pipe(
            ofType(actionTypes.EVENT_LIST_INIT_CANCEL),
            filter((cancelAction) => cancelAction.payload.listId === listId),
          ),
        ),
      );
    }),
  );

export const updateEventListEpic = (action$: InputObservable, store: ReduxStore) =>
  action$.pipe(
    ofType(actionTypes.EVENT_LIST_UPDATE),
    concatMap((action) => {
      const state = store.value;
      const { listId, queryArgs } = action.payload;
      const updatePromise = updateEventWorkingListAsync(listId, queryArgs, state);
      return from(updatePromise).pipe(
        takeUntil(
          action$.pipe(
            ofType(actionTypes.EVENT_LIST_UPDATE_CANCEL),
            filter((cancelAction) => cancelAction.payload.listId === listId),
          ),
        ),
        takeUntil(
          action$.pipe(
            ofType(actionTypes.EVENT_LIST_INIT_CANCEL),
            filter((cancelAction) => cancelAction.payload.listId === listId),
          ),
        ),
      );
    }),
  );

// TODO: --------------------------------- REFACTOR -----------------------------------
export const requestDeleteEventEpic = (action$: InputObservable) =>
  action$.pipe(
    ofType(eventListActionTypes.REQUEST_DELETE_EVENT),
    concatMap((action) => {
      const { eventId } = action.payload;
      const listId = 'eventList';
      const deletePromise = getApi()
        .delete(`events/${eventId}`)
        .then(() => deleteEventSuccess(eventId, listId))
        .catch((error) => {
          log.error(errorCreator('Could not delete event')({ error, eventId }));
          return deleteEventError();
        });

      return from(deletePromise).pipe(
        takeUntil(
          action$.pipe(
            ofType(actionTypes.CONTEXT_UNLOADING),
            filter((cancelAction) => cancelAction.payload.listId === listId),
          ),
        ),
      );
    }),
  );
