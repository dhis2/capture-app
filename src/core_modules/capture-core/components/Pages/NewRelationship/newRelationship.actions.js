// @flow
import { actionCreator } from '../../../actions/actions.utils';
import type { SelectedRelationshipType } from './newRelationship.types';
import { findModes } from './findModes';

export const actionTypes = {
  INITIALIZE_NEW_RELATIONSHIP: 'InitializeNewRelationship',
  SELECT_RELATIONSHIP_TYPE: 'SelectRelationshipType',
  DESELECT_RELATIONSHIP_TYPE: 'DeselectRelationshipType',
  SELECT_FIND_MODE: 'SelectFindMode',
  DESELECT_FIND_MODE: 'DeselectFindMode',
  SET_SEARCHING: 'SetSearching',
  UNSET_SEARCHING: 'UnsetSearching',
};

export const initializeNewRelationship = () =>
  actionCreator(actionTypes.INITIALIZE_NEW_RELATIONSHIP)({});

export const selectRelationshipType = (selectedRelationshipType: SelectedRelationshipType) =>
  actionCreator(actionTypes.SELECT_RELATIONSHIP_TYPE)({ selectedRelationshipType });

export const deselectRelationshipType = () =>
  actionCreator(actionTypes.DESELECT_RELATIONSHIP_TYPE)({});

export const selectFindMode = (findMode: $Values<typeof findModes>) =>
  actionCreator(actionTypes.SELECT_FIND_MODE)({ findMode });

export const deselectFindMode = () => actionCreator(actionTypes.DESELECT_FIND_MODE)({});

export const setSearching = () => actionCreator(actionTypes.SET_SEARCHING)({});

export const unsetSearching = () => actionCreator(actionTypes.UNSET_SEARCHING)({});
