// @flow
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
} from '../../../../DataEntry/actions/dataEntry.actions';

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

export const openRelationshipForNewSingleEventEpic = (action$: InputObservable) =>
    // $FlowSuppress
    action$.ofType(newEventDataEntryActionTypes.NEW_EVENT_OPEN_NEW_RELATIONSHIP)
        .map(() => initializeNewRelationship());

export const addRelationshipForNewSingleEventEpic = (action$: InputObservable) =>
    // $FlowSuppress
    action$.ofType(newEventNewRelationshipActionTypes.ADD_NEW_EVENT_RELATIONSHIP)
        .map((action) => {
            const payload = action.payload;

            const relationship = {
                to: typeToRelationshipConstraint[payload.entityType](payload.entityId),
                relationshipType: payload.relationshipTypeId,
                from: typeToRelationshipConstraint.PROGRAM_STAGE_INSTANCE(),
            };

            return addRelationship('singleEvent', 'newEvent', relationship);
        });

const saveNewEventRelationships = (action: Object) => {
    const eventId = action.payload.response.importSummaries[0].reference;
    const serverRelationshipData = {
        relationships: action.meta.relationshipData.map(r => ({
            ...r,
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
