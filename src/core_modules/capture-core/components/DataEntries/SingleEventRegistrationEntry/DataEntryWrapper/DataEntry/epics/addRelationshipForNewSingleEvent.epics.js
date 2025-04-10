// @flow
import uuid from 'd2-utilizr/lib/uuid';
import { ofType } from 'redux-observable';
import { map } from 'rxjs/operators';
import i18n from '@dhis2/d2-i18n';
import { batchActions } from 'redux-batched-actions';

import {
    initializeNewRelationship,
} from '../../../../../Pages/NewRelationship/newRelationship.actions';
import {
    recentlyAddedRelationship,
    actionTypes as newEventNewRelationshipActionTypes,
    batchActionTypes as newEventNewRelationshipBatchActionTypes,
} from '../../../NewRelationshipWrapper/NewEventNewRelationshipWrapper.actions';

import {
    startSaveNewEventRelationships,
    newEventSavedAfterReturnedToMainPage,
    newEventSavedAddAnother,
    newEventReturnToList,
    startSaveTeiForNewEventRelationship,
    actionTypes as newEventDataEntryActionTypes,
} from '../actions/dataEntry.actions';

import {
    addRelationship,
    relationshipAlreadyExists,
} from '../../../../../DataEntry/actions/dataEntry.actions';
import { getDataEntryKey } from '../../../../../DataEntry/common/getDataEntryKey';
import { convertClientRelationshipToServer } from '../../../../../../relationships/convertClientToServer';
import { getRelationshipNewTeiName } from '../../../../../Pages/NewRelationship/RegisterTei';

const dataEntryId = 'singleEvent';
const itemId = 'newEvent';
const dataEntryKey = getDataEntryKey(dataEntryId, itemId);

export const openRelationshipForNewSingleEventEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(newEventDataEntryActionTypes.NEW_EVENT_OPEN_NEW_RELATIONSHIP),
        map(() => initializeNewRelationship()));

export const addRelationshipForNewSingleEventEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(newEventNewRelationshipActionTypes.ADD_NEW_EVENT_RELATIONSHIP),
        map((action) => {
            const state = store.value;
            const existingRelationships = state.dataEntriesRelationships[dataEntryKey] || [];
            const payload = action.payload;
            const toEntity = payload.entity;


            const newRelationship = {
                clientId: uuid(),
                from: {
                    id: 'newEvent',
                    name: i18n.t('This event'),
                    type: 'PROGRAM_STAGE_INSTANCE',
                },
                to: {
                    ...toEntity,
                    name: toEntity.name || getRelationshipNewTeiName(toEntity.dataEntryId, toEntity.itemId, state),
                    type: payload.entityType,
                },
                relationshipType: { ...payload.relationshipType },
            };

            if (existingRelationships.some(r =>
                r.relationshipType.id === newRelationship.relationshipType.id &&
                r.to.id &&
                r.to.id === newRelationship.to.id)
            ) {
                const message = i18n.t(
                    'Relationship of type {{relationshipTypeName}} to {{entityName}} already exists',
                    {
                        entityName: newRelationship.to.name,
                        relationshipTypeName: newRelationship.relationshipType.name,
                        interpolation: { escapeValue: false },
                    },
                );
                return relationshipAlreadyExists(dataEntryId, itemId, message);
            }

            return batchActions([
                recentlyAddedRelationship(newRelationship.clientId),
                addRelationship(dataEntryId, itemId, newRelationship, toEntity),
            ], newEventNewRelationshipBatchActionTypes.ADD_RELATIONSHIP_BATCH);
        }));

const saveNewEventRelationships = (relationshipData, selections, triggerAction) => {
    const relationship = relationshipData.find(rd => rd.to.data);
    if (relationship) {
        const teiPayload = { trackedEntities: [{ ...relationship.to.data }] };
        return startSaveTeiForNewEventRelationship(teiPayload, selections, triggerAction, relationshipData, relationship.clientId);
    }

    const serverRelationshipData = {
        relationships: relationshipData.map(convertClientRelationshipToServer),
    };

    return startSaveNewEventRelationships(serverRelationshipData, selections, triggerAction);
};


export const saveNewEventRelationshipsIfExistsEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(newEventDataEntryActionTypes.SAVE_NEW_EVENT_RELATIONSHIPS_IF_EXISTS),
        map((action) => {
            const meta = action.meta;
            if (meta.relationshipData?.length) {
                const eventId = action.payload.bundleReport.typeReportMap.EVENT.objectReports[0].uid;
                const relationshipData = action.meta.relationshipData.map(relationship => ({
                    ...relationship,
                    from: {
                        ...relationship.from,
                        id: eventId,
                    },
                }));
                return saveNewEventRelationships(relationshipData, action.meta.selections, action.meta.triggerAction);
            }
            if (meta.triggerAction === newEventDataEntryActionTypes.START_SAVE_AFTER_RETURNED_TO_MAIN_PAGE) {
                return newEventSavedAfterReturnedToMainPage(meta.selections);
            }
            if (meta.triggerAction === newEventDataEntryActionTypes.START_SAVE_NEW_EVENT_ADD_ANOTHER) {
                return newEventSavedAddAnother(meta.selections);
            }
            if (meta.triggerAction === newEventDataEntryActionTypes.START_SAVE_NEW_EVENT_AND_RETURN_TO_LIST) {
                return newEventReturnToList(meta.selections);
            }

            return null;
        }));

export const saveNewEventRelationshipFinishedEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(
            newEventDataEntryActionTypes.NEW_EVENT_RELATIONSHIPS_SAVED,
            newEventDataEntryActionTypes.SAVE_FAILED_FOR_NEW_EVENT_RELATIONSHIPS,
            newEventDataEntryActionTypes.SAVE_FAILED_FOR_NEW_EVENT_RELATIONSHIPS_TEI,
        ),
        map((action) => {
            const meta = action.meta;
            if (meta.triggerAction === newEventDataEntryActionTypes.START_SAVE_AFTER_RETURNED_TO_MAIN_PAGE) {
                return newEventSavedAfterReturnedToMainPage(meta.selections);
            }
            if (meta.triggerAction === newEventDataEntryActionTypes.START_SAVE_NEW_EVENT_ADD_ANOTHER) {
                return newEventSavedAddAnother(meta.selections);
            }
            if (meta.triggerAction === newEventDataEntryActionTypes.START_SAVE_NEW_EVENT_AND_RETURN_TO_LIST) {
                return newEventReturnToList(meta.selections);
            }
            return null;
        }));

export const teiForNewEventRelationshipSavedEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(
            newEventDataEntryActionTypes.TEI_FOR_NEW_EVENT_RELATIONSHIPS_SAVED,
        ),
        map((action) => {
            const teiId = action.payload.bundleReport.typeReportMap.TRACKED_ENTITY.objectReports[0].uid;
            const { relationshipData, relationshipClientId, selections, triggerAction } = action.meta;
            const relationship = relationshipData.find(rd => rd.clientId === relationshipClientId);
            relationship.to.id = teiId;
            relationship.to.data = null;
            return saveNewEventRelationships(relationshipData, selections, triggerAction);
        }));
