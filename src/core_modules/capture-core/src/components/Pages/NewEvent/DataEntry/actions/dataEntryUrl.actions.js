// @flow
import { actionCreator } from '../../../../../actions/actions.utils';

export const actionTypes = {
    UPDATE_SELECTIONS_FROM_URL: 'UpdateSelectionsFromUrlForNewEvent',
    SET_ORG_UNIT_BASED_ON_URL: 'SetOrgUnitBasedOnUrlForNewEvent',
    INVALID_ORG_UNIT_FROM_URL: 'InvalidOrgUnitFromUrlForNewEvent',
    ERROR_RETRIEVING_ORG_UNIT_BASED_ON_URL: 'ErrorRetrievingOrgUnitBasedOnUrlForNewEvent',
    SET_EMPTY_ORG_UNIT_BASED_ON_URL: 'SetEmptyOrgUnitBasedOnUrlForNewEvent',
    INVALID_SELECTIONS_FROM_URL: 'InvalidSelectionsFromUrlForNewEvent',
    VALID_SELECTIONS_FROM_URL: 'ValidSelectionsFromUrlForNewEvent',
};

export const updateSelectionsFromUrl =
    (data: Object) =>
        actionCreator(actionTypes.UPDATE_SELECTIONS_FROM_URL)(data);

export const setCurrentOrgUnitBasedOnUrl =
    (orgUnit: Object) => actionCreator(actionTypes.SET_ORG_UNIT_BASED_ON_URL)(orgUnit);

export const invalidOrgUnitFromUrl =
    (error: string) => actionCreator(actionTypes.INVALID_ORG_UNIT_FROM_URL)(error);

export const errorRetrievingOrgUnitBasedOnUrl =
    (error: string) => actionCreator(actionTypes.ERROR_RETRIEVING_ORG_UNIT_BASED_ON_URL)(error);

export const setEmptyOrgUnitBasedOnUrl =
    () => actionCreator(actionTypes.SET_EMPTY_ORG_UNIT_BASED_ON_URL)();

export const validSelectionsFromUrl =
    () => actionCreator(actionTypes.VALID_SELECTIONS_FROM_URL)();

export const invalidSelectionsFromUrl =
    (error: string) => actionCreator(actionTypes.INVALID_SELECTIONS_FROM_URL)(error);

