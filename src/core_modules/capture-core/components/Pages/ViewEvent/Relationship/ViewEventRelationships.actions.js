// @flow
import { actionCreator } from '../../../../actions/actions.utils';
import { effectMethods } from '../../../../trackerOffline';

export const batchActionTypes = {
  LOAD_EVENT_RELATIONSHIPS_BATCH: 'LoadEventRelationshipsBatch',
  SAVE_EVENT_RELATIONSHIP_BATCH: 'SaveEventRelationshipBatch',
  DELETE_EVENT_RELATIONSHIP_BATCH: 'DeleteEventRelationshipBatch',
};

export const actionTypes = {
  EVENT_RELATIONSHIPS_LOADED: 'EventRelationshipsLoaded',
  EVENT_CANCEL_NEW_RELATIONSHIP: 'EventCancelNewRelationship',
  REQUEST_ADD_EVENT_RELATIONSHIP: 'RequestAddEventRelationship',
  START_SAVE_EVENT_RELATIONSHIP: 'StartSaveEventRelationship',
  EVENT_RELATIONSHIP_SAVED: 'EventRelationshipSaved',
  SAVE_FAILED_FOR_EVENT_RELATIONSHIP: 'SaveFailedForEventRelationship',
  EVENT_RELATIONSHIP_ALREADY_EXISTS: 'EventRelationshipAlreadyExists',
  START_DELETE_EVENT_RELATIONSHIP: 'StartDeleteEventRelationship',
  EVENT_RELATIONSHIP_DELETED: 'EventRelationshipDeleted',
  DELETE_FAILED_FOR_EVENT_RELATIONSHIP: 'DeleteFailedForEventRelationship',
  REQUEST_DELETE_EVENT_RELATIONSHIP: 'RequestDeleteEventRelationship',
  EVENT_RELATIONSHIP_NEW_TEI_SAVE: 'EventRelationshipNewTeiSave',
  EVENT_RELATIONSHIP_NEW_TEI_SAVE_SUCCESS: 'EventRelationshipNewTeiSaveSuccess',
  EVENT_RELATIONSHIP_NEW_TEI_SAVE_FAILED: 'EventRelationshipNewTeiSaveFailed',
};

export const eventRelationshipsLoaded = () =>
  actionCreator(actionTypes.EVENT_RELATIONSHIPS_LOADED)();

export const eventCancelNewRelationship = () =>
  actionCreator(actionTypes.EVENT_CANCEL_NEW_RELATIONSHIP)({});

export const requestAddEventRelationship = (
  relationshipType: { id: string, name: string },
  entity: Object,
  entityType: string,
) =>
  actionCreator(actionTypes.REQUEST_ADD_EVENT_RELATIONSHIP)({
    relationshipType,
    entity,
    entityType,
  });

export const eventRelationshipAlreadyExists = (message: string) =>
  actionCreator(actionTypes.EVENT_RELATIONSHIP_ALREADY_EXISTS)({ message });

export const saveEventRelationshipNewTei = (
  clientData: Object,
  selections: Object,
  clientId: string,
) =>
  actionCreator(actionTypes.EVENT_RELATIONSHIP_NEW_TEI_SAVE)(
    { selections },
    {
      offline: {
        effect: {
          url: 'trackedEntityInstances',
          method: effectMethods.POST,
          data: clientData.to.data,
          clientId,
        },
        commit: {
          type: actionTypes.EVENT_RELATIONSHIP_NEW_TEI_SAVE_SUCCESS,
          meta: { clientData, selections, clientId },
        },
        rollback: {
          type: actionTypes.EVENT_RELATIONSHIP_NEW_TEI_SAVE_FAILED,
          meta: { clientData, selections, clientId },
        },
      },
    },
  );

export const startSaveEventRelationship = (
  serverData: Object,
  selections: Object,
  clientId: string,
) =>
  actionCreator(actionTypes.START_SAVE_EVENT_RELATIONSHIP)(
    { selections },
    {
      offline: {
        effect: {
          url: 'relationships',
          method: effectMethods.POST,
          data: serverData,
          clientId,
        },
        commit: {
          type: actionTypes.EVENT_RELATIONSHIP_SAVED,
          meta: { selections, clientId },
        },
        rollback: {
          type: actionTypes.SAVE_FAILED_FOR_EVENT_RELATIONSHIP,
          meta: { selections, clientId },
        },
      },
    },
  );

const handleDequeueUpdate = (deleteAction, saveAction, responseAction) => {
  if (responseAction.type === 'SaveFailedForEventRelationship') return null;
  const relationshipId = responseAction.payload.response.importSummaries[0].reference;
  deleteAction.meta.offline.effect.url = `relationships/${relationshipId}`;
  return deleteAction;
};

export const requestDeleteEventRelationship = (clientId: string) =>
  actionCreator(actionTypes.REQUEST_DELETE_EVENT_RELATIONSHIP)({ clientId });

export const startDeleteEventRelationship = (
  relationshipId: ?string,
  clientId: string,
  selections: Object,
) =>
  actionCreator(actionTypes.START_DELETE_EVENT_RELATIONSHIP)(
    { selections },
    {
      offline: {
        effect: {
          url: relationshipId ? `relationships/${relationshipId}` : null,
          method: effectMethods.DELETE,
          clientId,
          updateOnDequeueCallback: handleDequeueUpdate.toString(),
        },
        commit: {
          type: actionTypes.EVENT_RELATIONSHIP_DELETED,
          meta: { selections, clientId },
        },
        rollback: {
          type: actionTypes.DELETE_FAILED_FOR_EVENT_RELATIONSHIP,
          meta: { selections, clientId },
        },
      },
    },
  );
