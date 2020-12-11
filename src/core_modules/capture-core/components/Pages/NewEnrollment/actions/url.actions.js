// @flow
import { actionCreator } from '../../../../actions/actions.utils';

export const actionTypes = {
  UPDATE_SELECTIONS_FROM_URL: 'UpdateSelectionsFromUrlForNewEnrollment',
  SET_ORG_UNIT_BASED_ON_URL: 'SetOrgUnitBasedOnUrlForNewEnrollment',
  ERROR_RETRIEVING_ORG_UNIT_BASED_ON_URL: 'ErrorRetrievingOrgUnitBasedOnUrlForNewEnrollment',
  SET_EMPTY_ORG_UNIT_BASED_ON_URL: 'SetEmptyOrgUnitBasedOnUrlForNewEnrollment',
  VALID_SELECTIONS_FROM_URL: 'ValidSelectionsFromUrlForNewEnrollment',
  INVALID_SELECTIONS_FROM_URL: 'InvalidSelectionsFromUrlForNewEnrollment',
};

export const updateSelectionsFromUrl = (data: Object) =>
  actionCreator(actionTypes.UPDATE_SELECTIONS_FROM_URL)(data);

export const setCurrentOrgUnitBasedOnUrl = (orgUnit: Object) =>
  actionCreator(actionTypes.SET_ORG_UNIT_BASED_ON_URL)({ orgUnit });

export const errorRetrievingOrgUnitBasedOnUrl = (error: string) =>
  actionCreator(actionTypes.ERROR_RETRIEVING_ORG_UNIT_BASED_ON_URL)({ error });

export const setEmptyOrgUnitBasedOnUrl = () =>
  actionCreator(actionTypes.SET_EMPTY_ORG_UNIT_BASED_ON_URL)();

export const validSelectionsFromUrl = () => actionCreator(actionTypes.VALID_SELECTIONS_FROM_URL)();

export const invalidSelectionsFromUrl = (error: string) =>
  actionCreator(actionTypes.INVALID_SELECTIONS_FROM_URL)({ error });
