// @flow
import uuid from 'd2-utilizr/src/uuid';
import i18n from '@dhis2/d2-i18n';

import {
    initializeNewRelationship,
} from '../../../NewRelationship/newRelationship.actions';
import {
    actionTypes as newEventNewRelationshipActionTypes,
} from '../../NewRelationshipWrapper/NewEventNewRelationshipWrapper.actions';

import {
    startSaveNewEventRelationships,
    newEventSavedAfterReturnedToMainPage,
    newEventSavedAddAnother,
    actionTypes as newEventDataEntryActionTypes,
} from '../../DataEntry/actions/dataEntry.actions';

import {
    addRelationship,
    duplicateRelationship,
} from '../../../../DataEntry/actions/dataEntry.actions';
import getDataEntryKey from '../../../../DataEntry/common/getDataEntryKey';

const typeToRelationshipConstraint = {
    TRACKED_ENTITY_INSTANCE: (entityId: ?string) => ({
        trackedEntityInstance: {
            trackedEntityInstance: entityId,
        },
    }),
    PROGRAM_STAGE_INSTANCE: (entityId: ?string) => ({
        event: {
            event: entityId,
        },
    }),
};
const dataEntryId = 'singleEvent';
const itemId = 'newEvent';
const dataEntryKey = getDataEntryKey(dataEntryId, itemId);

export const openRelationshipForNewSingleEventEpic = (action$: InputObservable) =>
    // $FlowSuppress
    action$.ofType(newEventDataEntryActionTypes.NEW_EVENT_OPEN_NEW_RELATIONSHIP)
        .map(() => initializeNewRelationship());

export const addRelationshipForNewSingleEventEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(newEventNewRelationshipActionTypes.ADD_NEW_EVENT_RELATIONSHIP)
        .map((action) => {
            const state = store.getState();
            const existingRelationships = state.dataEntriesRelationships[dataEntryKey] || [];
            const payload = action.payload;
            
            const newRelationship = {
                clientId: uuid(),
                entity: { ...payload.entity },
                entityType: payload.entityType,
                relationshipType: { ...payload.relationshipType },
            };

            if (existingRelationships.some(r =>
                r.relationshipType.id === newRelationship.relationshipType.id &&
                r.entity.id &&
                r.entity.id === newRelationship.entity.id)
            ) {
                const message = i18n.t(
                    'Relationship of type {{relationshipTypeName}} to {{entityName}} already exists',
                    {
                        entityName: newRelationship.entity.displayName,
                        relationshipTypeName: newRelationship.relationshipType.name,
                    },
                );
                return duplicateRelationship(dataEntryId, itemId, message);
            }

            return addRelationship(dataEntryId, itemId, newRelationship);
        });

const saveNewEventRelationships = (action: Object) => {
    const eventId = action.payload.response.importSummaries[0].reference;
    const serverRelationshipData = {
        relationships: action.meta.relationshipData.map(r => ({
            relationshipType: r.relationshipType.id,
            to: typeToRelationshipConstraint[r.entityType](r.entity.id),
            from: typeToRelationshipConstraint.PROGRAM_STAGE_INSTANCE(eventId),
        })),
    };
    return startSaveNewEventRelationships(serverRelationshipData, action.meta.selections, action.meta.triggerAction);
};

export const saveNewEventRelationshipsIfExistsEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(newEventDataEntryActionTypes.SAVE_NEW_EVENT_RELATIONSHIPS_IF_EXISTS)
        .map((action) => {
            const meta = action.meta;
            if (meta.relationshipData) {
                return saveNewEventRelationships(action);
            }
            if (meta.triggerAction === newEventDataEntryActionTypes.START_SAVE_AFTER_RETURNED_TO_MAIN_PAGE) {
                return newEventSavedAfterReturnedToMainPage(meta.selections);
            }
            if (meta.triggerAction === newEventDataEntryActionTypes.START_SAVE_NEW_EVENT_ADD_ANOTHER) {
                return newEventSavedAddAnother(meta.selections);
            }

            return null;
        });

export const saveNewEventRelationshipFinishedEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(
        newEventDataEntryActionTypes.NEW_EVENT_RELATIONSHIPS_SAVED,
        newEventDataEntryActionTypes.SAVE_FAILED_FOR_NEW_EVENT_RELATIONSHIPS,
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
