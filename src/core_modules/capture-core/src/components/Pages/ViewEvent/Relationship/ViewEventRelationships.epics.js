// @flow
import { batchActions } from 'redux-batched-actions';
import i18n from '@dhis2/d2-i18n';
import { ActionsObservable } from 'redux-observable';
import uuid from 'd2-utilizr/src/uuid';
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
} from './ViewEventRelationships.actions';
import {
    convertClientRelationshipToServer,
    getRelationshipsForEvent,
} from '../../../../relationships';

const relationshipKey = 'viewEvent';

export const loadRelationshipsForViewEventEpic = (action$: ActionsObservable) =>
    action$.ofType(
        viewEventActionTypes.ORG_UNIT_RETRIEVED_ON_URL_UPDATE,
        viewEventActionTypes.ORG_UNIT_RETRIEVAL_FAILED_ON_URL_UPDATE,
        viewEventActionTypes.START_OPEN_EVENT_FOR_VIEW,
    )
        .switchMap((action) => {
            // Load event relationships
            const event = action.payload.eventContainer.event;
            return getRelationshipsForEvent(event.eventId, event.programId)
                .then(relationships => batchActions([
                    eventRelationshipsLoaded(),
                    setRelationships(relationshipKey, relationships || []),
                ], viewEventRelationshipsBatchActionTypes.LOAD_EVENT_RELATIONSHIPS_BATCH));
        });

export const deleteRelationshipForViewEventEpic = (action$: ActionsObservable, store: ReduxStore) =>
    action$.ofType(
        viewEventRelationshipsActionTypes.REQUEST_DELETE_EVENT_RELATIONSHIP,
    ).map((action) => {
        const clientId = action.payload.clientId;
        const state = store.getState();
        const relationship = state.relationships.viewEvent.find(r => r.clientId === clientId);

        return batchActions([
            removeRelationship(relationshipKey, clientId),
            startDeleteEventRelationship(relationship.id, clientId, state.currentSelections),
        ], viewEventRelationshipsBatchActionTypes.DELETE_EVENT_RELATIONSHIP_BATCH);
    });


export const addRelationshipForViewEventEpic = (action$: ActionsObservable, store: ReduxStore) =>
    action$.ofType(viewEventRelationshipsActionTypes.REQUEST_ADD_EVENT_RELATIONSHIP)
        .map((action) => {
            const state = store.getState();
            const eventId = state.viewEventPage.eventId;
            const existingRelationships = state.dataEntriesRelationships[relationshipKey] || [];
            const payload = action.payload;

            const relationshipClientId = uuid();

            const clientRelationship = {
                clientId: relationshipClientId,
                from: {
                    id: eventId,
                    name: i18n.t('This event'),
                    type: 'PROGRAM_STAGE_INSTANCE',
                },
                to: {
                    ...payload.entity,
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

            const serverRelationshipData = {
                relationships: [convertClientRelationshipToServer(clientRelationship)],
            };

            return batchActions([
                addRelationship(relationshipKey, clientRelationship),
                startSaveEventRelationship(serverRelationshipData, state.currentSelections, relationshipClientId),
            ], viewEventRelationshipsBatchActionTypes.SAVE_EVENT_RELATIONSHIP_BATCH);
        });

export const saveRelationshipFailedForViewEventEpic = (action$: ActionsObservable) =>
    action$.ofType(viewEventRelationshipsActionTypes.SAVE_FAILED_FOR_EVENT_RELATIONSHIP)
        .map(action => removeRelationship(relationshipKey, action.meta.clientId));

export const RelationshipSavedForViewEventEpic = (action$: ActionsObservable, store: ReduxStore) =>
    action$.ofType(viewEventRelationshipsActionTypes.EVENT_RELATIONSHIP_SAVED)
        .map((action) => {
            const state = store.getState();
            const relationship = state.relationships[relationshipKey].find(r => r.clientId === action.meta.clientId);

            const relationshipId = action.payload.response.importSummaries[0].reference;
            const updatedRelationship = {
                ...relationship,
                id: relationshipId,
            };
            return updateRelationship(relationshipKey, updatedRelationship);
        });

