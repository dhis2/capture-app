// @flow
import { batchActions } from 'redux-batched-actions';
import { ofType } from 'redux-observable';
import { map, switchMap } from 'rxjs/operators';
import i18n from '@dhis2/d2-i18n';
import uuid from 'd2-utilizr/lib/uuid';
import {
    addRelationship,
    removeRelationship,
    updateRelationship,
    setRelationships,
} from '../../../Relationships/relationships.actions';
import {
    actionTypes as viewEventActionTypes,
} from '../ViewEventComponent/viewEvent.actions';

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
import { getRelationshipNewTeiName } from '../../NewRelationship/RegisterTei';

const relationshipKey = 'viewEvent';

export const loadRelationshipsForViewEventEpic = (
    action$: InputObservable,
    _: ReduxStore,
    { querySingleResource }: ApiUtils,
) =>
    action$.pipe(
        ofType(
            viewEventActionTypes.ORG_UNIT_RETRIEVED_ON_URL_UPDATE,
            viewEventActionTypes.ORG_UNIT_RETRIEVAL_FAILED_ON_URL_UPDATE,
            viewEventActionTypes.START_OPEN_EVENT_FOR_VIEW,
        ),
        switchMap((action) => {
            // Load event relationships
            const event = action.payload.eventContainer.event;
            return getRelationshipsForEvent(event.eventId, event.programId, event.programStageId, querySingleResource)
                .then(relationships => batchActions([
                    eventRelationshipsLoaded(),
                    setRelationships(relationshipKey, relationships || []),
                ], viewEventRelationshipsBatchActionTypes.LOAD_EVENT_RELATIONSHIPS_BATCH));
        }));

export const deleteRelationshipForViewEventEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(
            viewEventRelationshipsActionTypes.REQUEST_DELETE_EVENT_RELATIONSHIP,
        ),
        map((action) => {
            const clientId = action.payload.clientId;
            const state = store.value;
            const relationship = state.relationships.viewEvent.find(r => r.clientId === clientId);
            const serverData = { relationships: [{ relationship: relationship.id }] };

            return batchActions([
                removeRelationship(relationshipKey, clientId),
                startDeleteEventRelationship(serverData, clientId, state.currentSelections),
            ], viewEventRelationshipsBatchActionTypes.DELETE_EVENT_RELATIONSHIP_BATCH);
        }));


export const addRelationshipForViewEventEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(viewEventRelationshipsActionTypes.REQUEST_ADD_EVENT_RELATIONSHIP),
        map((action) => {
            const state = store.value;
            const eventId = state.viewEventPage.eventId;
            const existingRelationships = state.dataEntriesRelationships[relationshipKey] || [];
            const payload = action.payload;
            const toEntity = payload.entity;

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
                    name: toEntity.name || getRelationshipNewTeiName(toEntity.dataEntryId, toEntity.itemId, state),
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

export const saveRelationshipAfterSavingTeiForViewEventEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(viewEventRelationshipsActionTypes.EVENT_RELATIONSHIP_NEW_TEI_SAVE_SUCCESS),
        map((action) => {
            const teiId = action.payload.bundleReport.typeReportMap.TRACKED_ENTITY.objectReports[0].uid;
            const { clientData, selections, clientId } = action.meta;
            const to = clientData.to;
            to.data = null;
            to.id = teiId;

            const serverRelationshipData = {
                relationships: [convertClientRelationshipToServer(clientData)],
            };
            return startSaveEventRelationship(serverRelationshipData, selections, clientId);
        }));

export const handleViewEventRelationshipSaveTeiFailedEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(viewEventRelationshipsActionTypes.EVENT_RELATIONSHIP_NEW_TEI_SAVE_FAILED),
        map(action => removeRelationship(relationshipKey, action.meta.clientId)));

export const saveRelationshipFailedForViewEventEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(viewEventRelationshipsActionTypes.SAVE_FAILED_FOR_EVENT_RELATIONSHIP),
        map(action => removeRelationship(relationshipKey, action.meta.clientId)));

export const relationshipSavedForViewEventEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(viewEventRelationshipsActionTypes.EVENT_RELATIONSHIP_SAVED),
        map((action) => {
            const state = store.value;
            const relationship = state.relationships[relationshipKey].find(r => r.clientId === action.meta.clientId);

            const relationshipId = action.payload.bundleReport.typeReportMap.RELATIONSHIP.objectReports[0].uid;
            const updatedRelationship = {
                ...relationship,
                id: relationshipId,
            };
            return updateRelationship(relationshipKey, updatedRelationship);
        }));

