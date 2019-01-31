// @flow
import * as React from 'react';
import log from 'loglevel';
import isString from 'd2-utilizr/lib/isString';
import isObject from 'd2-utilizr/lib/isObject';
import errorCreator from '../../utils/errorCreator';
import i18n from '@dhis2/d2-i18n';
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import { actionTypes as feedbackActionTypes } from '../../components/FeedbackBar/actions/feedback.actions';
import { actionTypes as dataEntryActionTypes } from '../../components/DataEntry/actions/dataEntry.actions';
import { actionTypes as enrollmentActionTypes } from '../../actions/__TEMP__/enrollment.actions';
import { actionTypes as mainSelectionsActionTypes } from '../../components/Pages/MainPage/mainSelections.actions';
import {
    dataEntryActionTypes as newEventDataEntryActionTypes,
} from '../../components/Pages/NewEvent';
import {
    actionTypes as editEventDataEntryActionTypes,
} from '../../components/Pages/EditEvent/DataEntry/editEventDataEntry.actions';
import { actionTypes as eventsListActionTypes } from '../../components/Pages/MainPage/EventsList/eventsList.actions';
import { orgUnitListActionTypes } from '../../components/QuickSelector';

function addErrorFeedback(state: ReduxState, message: string, action?: ?React.Node) {
    const newState = [...state];
    newState.push({
        message,
        action,
        feedbackType: 'ERROR',
    });
    return newState;
}

function getErrorFeedback(message: string, action?: ?React.Node) {
    return {
        message,
        action,
        feedbackType: 'ERROR',
    };
}

export const feedbackDesc = createReducerDescription({
    [feedbackActionTypes.CLOSE_FEEDBACK]: (state) => {
        const newState = [...state];
        newState.shift();
        return newState;
    },
    [dataEntryActionTypes.COMPLETE_EVENT_ERROR]: (state, action) =>
        addErrorFeedback(state, action.payload.error, action.payload.action),
    [enrollmentActionTypes.ENROLLMENT_LOAD_FAILED]: (state, action) =>
        addErrorFeedback(state, action.payload),
    [mainSelectionsActionTypes.WORKING_LIST_DATA_RETRIEVAL_FAILED]: (state, action) =>
        addErrorFeedback(state, action.payload),
    [newEventDataEntryActionTypes.SAVE_FAILED_FOR_NEW_EVENT_AFTER_RETURNED_TO_MAIN_PAGE]: (state, action) => {
        const error = action.payload;
        const errorMessage = isString(error) ? error : error.message;
        const errorObject = isObject(error) ? error : null;
        log.error(errorCreator(errorMessage || i18n.t('Error saving event'))(errorObject));
        const newState = [
            ...state,
            getErrorFeedback(i18n.t('Could not save event. See log for details')),
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
            getErrorFeedback(i18n.t('Could not save event. See log for details')),
        ];
        return newState;
    },
    [eventsListActionTypes.WORKING_LIST_UPDATE_DATA_RETRIEVAL_FAILED]: (state, action) => [
        ...state,
        getErrorFeedback(action.payload),
    ],
    [dataEntryActionTypes.ASYNC_UPDATE_FIELD_FAILED]: (state, action) =>
        addErrorFeedback(state, action.payload.message),
    [newEventDataEntryActionTypes.SAVE_FAILED_FOR_NEW_EVENT_ADD_ANOTHER]: (state, action) => {
        const error = action.payload;
        const errorMessage = isString(error) ? error : error.message;
        const errorObject = isObject(error) ? error : null;
        log.error(errorCreator(errorMessage || i18n.t('Error saving event'))(errorObject));
        const newState = [
            ...state,
            getErrorFeedback(i18n.t('Could not save event. See log for details')),
        ];
        return newState;
    },
    [orgUnitListActionTypes.INIT_REG_UNIT_LIST_ROOTS_FAILED]: (state, action) =>
        addErrorFeedback(state, i18n.t(action.payload.message)),
    [orgUnitListActionTypes.SET_SEARCH_ROOTS_FAILED]: (state, action) =>
        addErrorFeedback(state, i18n.t(action.payload.message)),
    [dataEntryActionTypes.DUPLICATE_RELATIONSHIP]: (state, action) =>
        addErrorFeedback(state, action.payload.message),
}, 'feedbacks', []);

