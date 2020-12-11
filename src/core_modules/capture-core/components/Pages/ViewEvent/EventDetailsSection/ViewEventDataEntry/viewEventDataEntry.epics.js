// @flow
import { batchActions } from 'redux-batched-actions';
import { ofType } from 'redux-observable';
import { from, of } from 'rxjs';
import { map, filter, switchMap } from 'rxjs/operators';
import { filterByInnerAction, mapToInnerAction } from 'capture-core-utils/epics';
import { batchActionTypes as editEventDataEntryBatchActionTypes } from '../EditEventDataEntry/editEventDataEntry.actions';

import {
  loadViewEventDataEntry,
  prerequisitesErrorLoadingViewEventDataEntry,
} from './viewEventDataEntry.actions';

import { actionTypes as viewEventPageActionTypes } from '../../ViewEventComponent/viewEvent.actions';
import { getProgramAndStageFromEvent } from '../../../../../metaData';

export const loadViewEventDataEntryEpic: Epic = (action$, store) =>
  action$.pipe(
    ofType(
      viewEventPageActionTypes.ORG_UNIT_RETRIEVED_ON_URL_UPDATE,
      viewEventPageActionTypes.ORG_UNIT_RETRIEVAL_FAILED_ON_URL_UPDATE,
      viewEventPageActionTypes.START_OPEN_EVENT_FOR_VIEW,
      viewEventPageActionTypes.UPDATE_EVENT_CONTAINER,
      editEventDataEntryBatchActionTypes.START_SAVE_EDIT_EVENT_DATA_ENTRY_BATCH,
    ),
    filter((action) =>
      filterByInnerAction(
        action,
        editEventDataEntryBatchActionTypes.START_SAVE_EDIT_EVENT_DATA_ENTRY_BATCH,
        viewEventPageActionTypes.UPDATE_EVENT_CONTAINER,
      ),
    ),
    map((action) =>
      mapToInnerAction(
        action,
        editEventDataEntryBatchActionTypes.START_SAVE_EDIT_EVENT_DATA_ENTRY_BATCH,
        viewEventPageActionTypes.UPDATE_EVENT_CONTAINER,
      ),
    ),
    filter((action) => {
      // Check if current view event is container event. Also check if in view mode.
      const eventId = action.payload.eventContainer.id;
      const state = store.value;
      const viewEventPage = state.viewEventPage || {};
      return viewEventPage.eventId === eventId && !viewEventPage.showEditEvent;
    }),
    switchMap((action) => {
      const { eventContainer } = action.payload;
      const { orgUnit } = action.payload;
      const metadataContainer = getProgramAndStageFromEvent(eventContainer.event);
      if (metadataContainer.error) {
        return of(prerequisitesErrorLoadingViewEventDataEntry(metadataContainer.error));
      }
      const foundation = metadataContainer.stage.stageForm;
      const { program } = metadataContainer;
      return from(loadViewEventDataEntry(eventContainer, orgUnit, foundation, program)).pipe(
        map((item) => batchActions(item)),
      );
    }),
  );
