// @flow
import uuid from 'd2-utilizr/lib/uuid';
import i18n from '@dhis2/d2-i18n';
import { batchActions } from 'redux-batched-actions';

import {
    initializeNewRelationship,
} from '../../../NewRelationship/newRelationship.actions';
import {
    recentlyAddedRelationship,
    actionTypes as newEventNewRelationshipActionTypes,
    batchActionTypes as newEventNewRelationshipBatchActionTypes,
} from '../../NewRelationshipWrapper/NewEventNewRelationshipWrapper.actions';

import {
    startSaveNewEventRelationships,
    newEventSavedAfterReturnedToMainPage,
    newEventSavedAddAnother,
    startSaveTeiForNewEventRelationship,
    actionTypes as newEventDataEntryActionTypes,
} from '../../DataEntry/actions/dataEntry.actions';

import {
    addRelationship,
    relationshipAlreadyExists,
} from '../../../../DataEntry/actions/dataEntry.actions';
import getDataEntryKey from '../../../../DataEntry/common/getDataEntryKey';
import convertClientRelationshipToServer from '../../../../../relationships/convertClientToServer';
import { getRelationshipNewTei } from '../../../NewRelationship/RegisterTei';

const dataEntryId = 'singleEvent';
const itemId = 'newEvent';
const dataEntryKey = getDataEntryKey(dataEntryId, itemId);

export const openRelationshipForNewSingleEventEpic = (action$: InputObservable) =>
   
    // $FlowFixMe[prop-missing] automated comment
    action$.ofType(newEventDataEntryActionTypes.NEW_EVENT_OPEN_NEW_RELATIONSHIP)
        .map(() => initializeNewRelationship());

export const addRelationshipForNewSingleEventEpic = (action$: InputObservable, store: ReduxStore) =>
   
    // $FlowFixMe[prop-missing] automated comment
    action$.ofType(newEventNewRelationshipActionTypes.ADD_NEW_EVENT_RELATIONSHIP)
        .map((action) => {
            const state = store.getState();
            const existingRelationships = state.dataEntriesRelationships[dataEntryKey] || [];
            const payload = action.payload;
            const entity = payload.entity;

            const toEntity = entity.id ? entity : getRelationshipNewTei(entity.dataEntryId, entity.itemId, state);
            const toEntityIsNew = !entity.id;
            const newToEntity = toEntityIsNew ? {
                dataEntryId: entity.dataEntryId,
            } : null;

            const newRelationship = {
                clientId: uuid(),
                from: {
                    id: 'newEvent',
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
                r.relationshipType.id === newRelationship.relationshipType.id &&
                r.to.id &&
                r.to.id === newRelationship.to.id)
            ) {
                const message = i18n.t(
                    'Relationship of type {{relationshipTypeName}} to {{entityName}} already exists',
                    {
                        entityName: newRelationship.to.name,
                        relationshipTypeName: newRelationship.relationshipType.name,
                    },
                );
                return relationshipAlreadyExists(dataEntryId, itemId, message);
            }

            return batchActions([
                recentlyAddedRelationship(newRelationship.clientId),
                addRelationship(dataEntryId, itemId, newRelationship, newToEntity),
            ], newEventNewRelationshipBatchActionTypes.ADD_RELATIONSHIP_BATCH);
        });

const saveNewEventRelationships = (relationshipData, selections, triggerAction) => {
    const relationship = relationshipData.find(rd => rd.to.data);
    if (relationship) {
        const teiPayload = relationship.to.data;
        return startSaveTeiForNewEventRelationship(teiPayload, selections, triggerAction, relationshipData, relationship.clientId);
    }

    const serverRelationshipData = {
        relationships: relationshipData.map(convertClientRelationshipToServer),
    };

    return startSaveNewEventRelationships(serverRelationshipData, selections, triggerAction);
};


export const saveNewEventRelationshipsIfExistsEpic = (action$: InputObservable) =>
   
    // $FlowFixMe[prop-missing] automated comment
    action$.ofType(newEventDataEntryActionTypes.SAVE_NEW_EVENT_RELATIONSHIPS_IF_EXISTS)
        .map((action) => {
            const meta = action.meta;
            if (meta.relationshipData) {
                const eventId = action.payload.response.importSummaries[0].reference;
                const relationshipData = action.meta.relationshipData.map((r) => {
                    const clientRelationship = {
                        ...r,
                        from: {
                            ...r.from,
                            id: eventId,
                        },
                    };
                    return clientRelationship;
                });
                return saveNewEventRelationships(relationshipData, action.meta.selections, action.meta.triggerAction);
            }
            if (meta.triggerAction === newEventDataEntryActionTypes.START_SAVE_AFTER_RETURNED_TO_MAIN_PAGE) {
                return newEventSavedAfterReturnedToMainPage(meta.selections);
            }
            if (meta.triggerAction === newEventDataEntryActionTypes.START_SAVE_NEW_EVENT_ADD_ANOTHER) {
                return newEventSavedAddAnother(meta.selections);
            }

            return null;
        });

export const saveNewEventRelationshipFinishedEpic = (action$: InputObservable) =>
   
    // $FlowFixMe[prop-missing] automated comment
    action$.ofType(
        newEventDataEntryActionTypes.NEW_EVENT_RELATIONSHIPS_SAVED,
        newEventDataEntryActionTypes.SAVE_FAILED_FOR_NEW_EVENT_RELATIONSHIPS,
        newEventDataEntryActionTypes.SAVE_FAILED_FOR_NEW_EVENT_RELATIONSHIPS_TEI,
    )
        .map((action) => {
            const meta = action.meta;
            if (meta.triggerAction === newEventDataEntryActionTypes.START_SAVE_AFTER_RETURNED_TO_MAIN_PAGE) {
                return newEventSavedAfterReturnedToMainPage(meta.selections);
            }
            if (meta.triggerAction === newEventDataEntryActionTypes.START_SAVE_NEW_EVENT_ADD_ANOTHER) {
                return newEventSavedAddAnother(meta.selections);
            }
            return null;
        });

export const teiForNewEventRelationshipSavedEpic = (action$: InputObservable) =>
   
    // $FlowFixMe[prop-missing] automated comment
    action$.ofType(
        newEventDataEntryActionTypes.TEI_FOR_NEW_EVENT_RELATIONSHIPS_SAVED,
    )
        .map((action) => {
            const teiId = action.payload.response.importSummaries[0].reference;
            const { relationshipData, relationshipClientId, selections, triggerAction } = action.meta;
            const relationship = relationshipData.find(rd => rd.clientId === relationshipClientId);
            relationship.to.id = teiId;
            relationship.to.data = null;
            return saveNewEventRelationships(relationshipData, selections, triggerAction);
        });
