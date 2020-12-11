// @flow
import { actionCreator } from '../../actions/actions.utils';
import type { Relationship } from './relationships.types';

export const actionTypes = {
  SET_RELATIONSHIPS: 'SetRelationships',
  ADD_RELATIONSHIP: 'AddRelationship',
  UPDATE_RELATIONSHIP: 'UpdateRelationship',
  REMOVE_RELATIONSHIP: 'RemoveRelationship',
};

export const setRelationships = (key: string, relationships: Array<Relationship>) =>
  actionCreator(actionTypes.SET_RELATIONSHIPS)({ key, relationships });

export const addRelationship = (key: string, relationship: Relationship) =>
  actionCreator(actionTypes.ADD_RELATIONSHIP)({ key, relationship });

export const updateRelationship = (key: string, updatedRelationship: Relationship) =>
  actionCreator(actionTypes.UPDATE_RELATIONSHIP)({
    key,
    updatedRelationship,
  });

export const removeRelationship = (key: string, relationshipClientId: string) =>
  actionCreator(actionTypes.REMOVE_RELATIONSHIP)({
    key,
    relationshipClientId,
  });
