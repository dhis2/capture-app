// @flow
import { batchActions } from 'redux-batched-actions';
import { ofType, ActionsObservable } from 'redux-observable';
import { map, switchMap } from 'rxjs/operators';
import i18n from '@dhis2/d2-i18n';
import { ActionsObservable } from 'redux-observable';
import uuid from 'd2-utilizr/lib/uuid';
import {
    addRelationship,
    removeRelationship,
    updateRelationship,
    setRelationships,
} from '../../../Relationships/relationships.actions';
import {
    actionTypes as viewEventActionTypes,
} from '../viewEvent.actions';

import {
    actionTypes as viewEventRelationshipsActionTypes,
    batchActionTypes as viewEventRelationshipsBatchActionTypes,
    startSaveEventRelationship,
    eventRelationshipAlreadyExists,
    startDeleteEventRelationship,
    eventRelationshipsLoaded,
    saveEventRelationshipNewTei,
} from './ViewEventRelationships.actions';
import {
    convertClientRelationshipToServer,
    getRelationshipsForEvent,
} from '../../../../relationships';
import { getRelationshipNewTei } from '../../NewRelationship/RegisterTei';

const relationshipKey = 'viewEvent';

export const loadRelationshipsForViewEventEpic = (action$: ActionsObservable) =>
    action$.pipe(
        ofType(
            viewEventActionTypes.ORG_UNIT_RETRIEVED_ON_URL_UPDATE,
            viewEventActionTypes.ORG_UNIT_RETRIEVAL_FAILED_ON_URL_UPDATE,
            viewEventActionTypes.START_OPEN_EVENT_FOR_VIEW,
        ),
        switchMap((action) => {
            // Load event relationships
            const event = action.payload.eventContainer.event;
            return getRelationshipsForEvent(event.eventId, event.programId)
                .then(relationships => batchActions([
                    eventRelationshipsLoaded(),
                    setRelationships(relationshipKey, relationships || []),
                ], viewEventRelationshipsBatchActionTypes.LOAD_EVENT_RELATIONSHIPS_BATCH));
        }));

export const deleteRelationshipForViewEventEpic = (action$: ActionsObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(
            viewEventRelationshipsActionTypes.REQUEST_DELETE_EVENT_RELATIONSHIP,
        ),
        map((action) => {
            const clientId = action.payload.clientId;
            const state = store.getState();
            const relationship = state.relationships.viewEvent.find(r => r.clientId === clientId);

            return batchActions([
                removeRelationship(relationshipKey, clientId),
                startDeleteEventRelationship(relationship.id, clientId, state.currentSelections),
            ], viewEventRelationshipsBatchActionTypes.DELETE_EVENT_RELATIONSHIP_BATCH);
        }));


export const addRelationshipForViewEventEpic = (action$: ActionsObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(viewEventRelationshipsActionTypes.REQUEST_ADD_EVENT_RELATIONSHIP),
        map((action) => {
            const state = store.getState();
            const eventId = state.viewEventPage.eventId;
            const existingRelationships = state.dataEntriesRelationships[relationshipKey] || [];
            const payload = action.payload;
            const entity = payload.entity;

            const toEntity = entity.id ? entity : getRelationshipNewTei(entity.dataEntryId, entity.itemId, state);

            const relationshipClientId = uuid();
            const clientRelationship = {
                clientId: relationshipClientId,
                from: {
                    id: eventId,
                    name: i18n.t('This event'),
                    type: 'PROGRAM_STAGE_INSTANCE',
                },
                to: {
                    ...toEntity,
                    type: payload.entityType,
                },
                relationshipType: { ...payload.relationshipType },
            };

            if (existingRelationships.some(r =>
                r.relationshipType.id === clientRelationship.relationshipType.id &&
                    r.to.id &&
                    r.to.id === clientRelationship.to.id)
            ) {
                const message = i18n.t(
                    'Relationship of type {{relationshipTypeName}} to {{entityName}} already exists',
                    {
                        entityName: clientRelationship.from.name,
                        relationshipTypeName: clientRelationship.relationshipType.name,
                    },
                );
                return eventRelationshipAlreadyExists(message);
            }

            let saveAction;
            if (toEntity.data) {
                // save new tei before saving the relationship
                saveAction = saveEventRelationshipNewTei(clientRelationship, state.currentSelections, relationshipClientId);
            } else {
                const serverRelationshipData = {
                    relationships: [convertClientRelationshipToServer(clientRelationship)],
                };
                saveAction = startSaveEventRelationship(serverRelationshipData, state.currentSelections, relationshipClientId);
            }

            return batchActions([
                addRelationship(relationshipKey, clientRelationship),
                saveAction,
            ], viewEventRelationshipsBatchActionTypes.SAVE_EVENT_RELATIONSHIP_BATCH);
        }));

export const saveRelationshipAfterSavingTeiForViewEventEpic = (action$: ActionsObservable) =>
    action$.pipe(
        ofType(viewEventRelationshipsActionTypes.EVENT_RELATIONSHIP_NEW_TEI_SAVE_SUCCESS),
        map((action) => {
            const teiId = action.payload.response.importSummaries[0].reference;
            const { clientData, selections, clientId } = action.meta;
            const to = clientData.to;
            to.data = null;
            to.id = teiId;

            const serverRelationshipData = {
                relationships: [convertClientRelationshipToServer(clientData)],
            };
            return startSaveEventRelationship(serverRelationshipData, selections, clientId);
        }));

export const handleViewEventRelationshipSaveTeiFailedEpic = (action$: ActionsObservable) =>
    action$.pipe(
        ofType(viewEventRelationshipsActionTypes.EVENT_RELATIONSHIP_NEW_TEI_SAVE_FAILED),
        map(action => removeRelationship(relationshipKey, action.meta.clientId)));

export const saveRelationshipFailedForViewEventEpic = (action$: ActionsObservable) =>
    action$.pipe(
        ofType(viewEventRelationshipsActionTypes.SAVE_FAILED_FOR_EVENT_RELATIONSHIP),
        map(action => removeRelationship(relationshipKey, action.meta.clientId)));

export const relationshipSavedForViewEventEpic = (action$: ActionsObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(viewEventRelationshipsActionTypes.EVENT_RELATIONSHIP_SAVED),
        map((action) => {
            const state = store.getState();
            const relationship = state.relationships[relationshipKey].find(r => r.clientId === action.meta.clientId);

            const relationshipId = action.payload.response.importSummaries[0].reference;
            const updatedRelationship = {
                ...relationship,
                id: relationshipId,
            };
            return updateRelationship(relationshipKey, updatedRelationship);
        }));

