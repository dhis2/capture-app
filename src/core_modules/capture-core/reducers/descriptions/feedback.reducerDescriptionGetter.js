// @flow
import type { Node } from 'react';
import log from 'loglevel';
import i18n from '@dhis2/d2-i18n';
import isString from 'd2-utilizr/lib/isString';
import isObject from 'd2-utilizr/lib/isObject';
import { errorCreator } from 'capture-core-utils';
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import { actionTypes as feedbackActionTypes } from '../../components/FeedbackBar/actions/feedback.actions';
import { actionTypes as dataEntryActionTypes } from '../../components/DataEntry/actions/dataEntry.actions';
import { actionTypes as enrollmentActionTypes } from '../../actions/__TEMP__/enrollment.actions';
import {
    dataEntryActionTypes as newEventDataEntryActionTypes,
} from '../../components/DataEntries/SingleEventRegistrationEntry';
import {
    actionTypes as editEventDataEntryActionTypes,
} from '../../components/Pages/EditEvent/DataEntry/editEventDataEntry.actions';
import { orgUnitListActionTypes } from '../../components/LockedSelector/QuickSelector';
import {
    actionTypes as viewEventNewRelationshipActionTypes,
} from '../../components/Pages/ViewEvent/Relationship/ViewEventRelationships.actions';
import { asyncHandlerActionTypes } from '../../components/D2Form';
import { registrationSectionActionTypes } from '../../components/Pages/NewRelationship/RegisterTei';
import { eventWorkingListsActionTypes } from '../../components/Pages/MainPage/EventWorkingLists';
import { workingListsCommonActionTypes } from '../../components/Pages/MainPage/WorkingListsCommon';
import type { Updaters } from '../../trackerRedux/trackerReducer';
import { registrationFormActionTypes } from '../../components/Pages/New/RegistrationDataEntry/RegistrationDataEntry.actions';

function addErrorFeedback(state: ReduxState, message: string, action?: ?Node) {
    const newState = [...state];
    newState.push({
        message,
        action,
        feedbackType: 'ERROR',
    });
    return newState;
}

function getErrorFeedback(message: string, action?: ?Node) {
    return {
        message,
        action,
        feedbackType: 'ERROR',
    };
}

export const getFeedbackDesc = (appUpdaters: Updaters) => createReducerDescription({
    ...appUpdaters,
    [feedbackActionTypes.CLOSE_FEEDBACK]: (state) => {
        const newState = [...state];
        newState.shift();
        return newState;
    },
    [dataEntryActionTypes.COMPLETE_EVENT_ERROR]: (state, action) =>
        addErrorFeedback(state, action.payload.error, action.payload.action),
    [enrollmentActionTypes.ENROLLMENT_LOAD_FAILED]: (state, action) =>
        addErrorFeedback(state, action.payload),
    [workingListsCommonActionTypes.LIST_VIEW_INIT_ERROR]: (state, action) =>
        addErrorFeedback(state, action.payload.errorMessage),
    [newEventDataEntryActionTypes.SAVE_FAILED_FOR_NEW_EVENT_AFTER_RETURNED_TO_MAIN_PAGE]: (state, action) => {
        const error = action.payload;
        const errorMessage = isString(error) ? error : error.message;
        const errorObject = isObject(error) ? error : null;
        log.error(errorCreator(errorMessage || i18n.t('Error saving event'))(errorObject));
        const newState = [
            ...state,
            getErrorFeedback(i18n.t('Could not save event')),
        ];
        return newState;
    },
    [editEventDataEntryActionTypes.EVENT_UPDATE_FAILED_AFTER_RETURN_TO_MAIN_PAGE]: (state, action) => {
        const error = action.payload;
        const errorMessage = isString(error) ? error : error.message;
        const errorObject = isObject(error) ? error : null;
        log.error(errorCreator(errorMessage || i18n.t('Error saving event'))(errorObject));
        const newState = [
            ...state,
            getErrorFeedback(i18n.t('Could not save event')),
        ];
        return newState;
    },
    [workingListsCommonActionTypes.LIST_UPDATE_ERROR]: (state, action) => [
        ...state,
        getErrorFeedback(action.payload.errorMessage),
    ],
    [eventWorkingListsActionTypes.EVENT_DELETE_ERROR]: state => [
        ...state,
        getErrorFeedback(i18n.t('Could not delete event')),
    ],
    [workingListsCommonActionTypes.TEMPLATE_UPDATE_ERROR]: state => [
        ...state,
        getErrorFeedback(i18n.t('Could not save working list')),
    ],
    [workingListsCommonActionTypes.TEMPLATE_ADD_ERROR]: state => [
        ...state,
        getErrorFeedback(i18n.t('Could not add working list')),
    ],
    [workingListsCommonActionTypes.TEMPLATE_DELETE_ERROR]: state => [
        ...state,
        getErrorFeedback(i18n.t('Could not delete working list')),
    ],
    [asyncHandlerActionTypes.ASYNC_UPDATE_FIELD_FAILED]: (state, action) =>
        addErrorFeedback(state, action.payload.message),
    [newEventDataEntryActionTypes.SAVE_FAILED_FOR_NEW_EVENT_ADD_ANOTHER]: (state, action) => {
        const error = action.payload;
        const errorMessage = isString(error) ? error : error.message;
        const errorObject = isObject(error) ? error : null;
        log.error(errorCreator(errorMessage || i18n.t('Error saving event'))(errorObject));
        const newState = [
            ...state,
            getErrorFeedback(i18n.t('Could not save event')),
        ];
        return newState;
    },
    [orgUnitListActionTypes.INIT_REG_UNIT_LIST_ROOTS_FAILED]: (state, action) =>
        addErrorFeedback(state, i18n.t(action.payload.message)),
    [orgUnitListActionTypes.SET_SEARCH_ROOTS_FAILED]: (state, action) =>
        addErrorFeedback(state, i18n.t(action.payload.message)),
    [dataEntryActionTypes.DATA_ENTRY_RELATIONSHIP_ALREADY_EXISTS]: (state, action) =>
        addErrorFeedback(state, action.payload.message),
    [viewEventNewRelationshipActionTypes.EVENT_RELATIONSHIP_ALREADY_EXISTS]: (state, action) =>
        addErrorFeedback(state, action.payload.message),
    [registrationSectionActionTypes.ORG_UNIT_SEARCH_FAILED]: state =>
        addErrorFeedback(state, i18n.t('Organisation unit search failed.')),
    [registrationFormActionTypes.NEW_TRACKED_ENTITY_INSTANCE_SAVE_FAILED]: state =>
        addErrorFeedback(state, i18n.t('Error saving tracked entity instance')),
    [registrationFormActionTypes.NEW_TRACKED_ENTITY_INSTANCE_WITH_ENROLLMENT_SAVE_FAILED]: state =>
        addErrorFeedback(state, i18n.t('Error saving enrollment')),
}, 'feedbacks', []);

