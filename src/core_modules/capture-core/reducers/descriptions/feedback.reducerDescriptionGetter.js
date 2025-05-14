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
    actionTypes as editEventDataEntryAction,
    actionTypes as editEventActionTypes } from '../../components/WidgetEventEdit/EditEventDataEntry/editEventDataEntry.actions';
import {
    actionTypes as viewEventNewRelationshipActionTypes,
} from '../../components/Pages/ViewEvent/Relationship/ViewEventRelationships.actions';
import { asyncHandlerActionTypes } from '../../components/D2Form';
import { registrationSectionActionTypes } from '../../components/Pages/NewRelationship/RegisterTei';
import { eventWorkingListsActionTypes } from '../../components/WorkingLists/EventWorkingLists';
import { workingListsCommonActionTypes } from '../../components/WorkingLists/WorkingListsCommon';
import type { Updaters } from '../../trackerRedux/trackerReducer';
import { registrationFormActionTypes } from '../../components/Pages/New/RegistrationDataEntry/RegistrationDataEntry.actions';
import { enrollmentSiteActionTypes } from '../../components/Pages/common/EnrollmentOverviewDomain';
import { enrollmentEditEventActionTypes } from '../../components/Pages/EnrollmentEditEvent';
import { actionTypes as viewEventActionTypes } from '../../components/Pages/ViewEvent/ViewEventComponent/viewEvent.actions';

const alertVariants = {
    info: 'info',
    success: 'success',
    warning: 'warning',
    critical: 'critical',
};

type ErrorFeedbackInput = {
    message: string,
    variant?: string,
    action?: Node,
};

function addErrorFeedback(state: ReduxState, { message, variant, action }: ErrorFeedbackInput) {
    return [
        ...state,
        {
            message,
            action,
            feedbackType: 'ERROR',
            variant,
        },
    ];
}

function getErrorFeedback({ message, variant, action }: ErrorFeedbackInput) {
    return {
        message,
        action,
        feedbackType: 'ERROR',
        variant,
    };
}

export const getFeedbackDesc = (appUpdaters: Updaters) =>
    createReducerDescription(
        {
            ...appUpdaters,

            [feedbackActionTypes.CLOSE_FEEDBACK]: (state) => {
                const newState = [...state];
                newState.shift();
                return newState;
            },

            [dataEntryActionTypes.COMPLETE_EVENT_ERROR]: (state, action) =>
                addErrorFeedback(state, {
                    message: action.payload.error,
                    action: action.payload.action,
                    variant: alertVariants.critical,
                }),

            [enrollmentActionTypes.ENROLLMENT_LOAD_FAILED]: (state, action) =>
                addErrorFeedback(state, { message: action.payload }),

            [workingListsCommonActionTypes.LIST_VIEW_INIT_ERROR]: (state, action) =>
                addErrorFeedback(state, { message: action.payload.errorMessage }),

            [newEventDataEntryActionTypes.SAVE_FAILED_FOR_NEW_EVENT_AFTER_RETURNED_TO_MAIN_PAGE]: (
                state,
                action,
            ) => {
                const error = action.payload;
                const errorMessage = isString(error) ? error : error.message;
                const errorObject = isObject(error) ? error : null;
                log.error(errorCreator(errorMessage || i18n.t('Error saving event'))(errorObject));

                return [
                    ...state,
                    getErrorFeedback({
                        message: i18n.t('Could not save event'),
                        variant: alertVariants.critical,
                    }),
                ];
            },

            [workingListsCommonActionTypes.LIST_UPDATE_ERROR]: (state, action) => [
                ...state,
                getErrorFeedback({
                    message: action.payload.errorMessage,
                    variant: alertVariants.critical,
                }),
            ],

            [eventWorkingListsActionTypes.EVENT_DELETE_ERROR]: state => [
                ...state,
                getErrorFeedback({ message: i18n.t('Could not delete event') }),
            ],

            [workingListsCommonActionTypes.TEMPLATE_UPDATE_ERROR]: state => [
                ...state,
                getErrorFeedback({
                    message: i18n.t('Could not save working list'),
                    variant: alertVariants.critical,
                }),
            ],

            [workingListsCommonActionTypes.TEMPLATE_ADD_ERROR]: state => [
                ...state,
                getErrorFeedback({
                    message: i18n.t('Could not add working list'),
                    variant: alertVariants.critical,
                }),
            ],

            [workingListsCommonActionTypes.TEMPLATE_DELETE_ERROR]: state => [
                ...state,
                getErrorFeedback({ message: i18n.t('Could not delete working list') }),
            ],

            [asyncHandlerActionTypes.ASYNC_UPDATE_FIELD_FAILED]: (state, action) =>
                addErrorFeedback(state, {
                    message: action.payload.message,
                    variant: alertVariants.critical,
                }),

            [newEventDataEntryActionTypes.SAVE_FAILED_FOR_NEW_EVENT_ADD_ANOTHER]: (
                state,
                action,
            ) => {
                const error = action.payload;
                const errorMessage = isString(error) ? error : error.message;
                const errorObject = isObject(error) ? error : null;
                log.error(errorCreator(errorMessage || i18n.t('Error saving event'))(errorObject));

                return [
                    ...state,
                    getErrorFeedback({
                        message: i18n.t('Could not save event'),
                        variant: alertVariants.critical,
                    }),
                ];
            },

            [dataEntryActionTypes.DATA_ENTRY_RELATIONSHIP_ALREADY_EXISTS]: (state, action) =>
                addErrorFeedback(state, { message: action.payload.message }),

            [viewEventNewRelationshipActionTypes.EVENT_RELATIONSHIP_ALREADY_EXISTS]: (
                state,
                action,
            ) => addErrorFeedback(state, { message: action.payload.message }),

            [registrationSectionActionTypes.ORG_UNIT_SEARCH_FAILED]: state =>
                addErrorFeedback(state, { message: i18n.t('Organisation unit search failed.') }),

            [registrationFormActionTypes.NEW_TRACKED_ENTITY_INSTANCE_SAVE_FAILED]: state =>
                addErrorFeedback(state, {
                    message: i18n.t('Error saving tracked entity instance'),
                    variant: alertVariants.critical,
                }),

            [registrationFormActionTypes.NEW_TRACKED_ENTITY_INSTANCE_WITH_ENROLLMENT_SAVE_FAILED]: state =>
                addErrorFeedback(state, {
                    message: i18n.t('Error saving enrollment'),
                    variant: alertVariants.critical,
                }),

            [enrollmentSiteActionTypes.SAVE_FAILED]: state =>
                addErrorFeedback(state, {
                    message: i18n.t('Error saving the enrollment event'),
                    variant: alertVariants.critical,
                }),

            [editEventActionTypes.DELETE_EVENT_DATA_ENTRY_FAILED]: state =>
                addErrorFeedback(state, { message: i18n.t('Error deleting the enrollment event') }),

            [editEventDataEntryAction.SAVE_EDIT_EVENT_DATA_ENTRY_FAILED]: state =>
                addErrorFeedback(state, {
                    message: i18n.t('Error editing the event, the changes made were not saved'),
                    variant: alertVariants.critical,
                }),

            [enrollmentSiteActionTypes.ERROR_ENROLLMENT]: (state, action) =>
                addErrorFeedback(state, { message: i18n.t(action.payload.message) }),

            [viewEventActionTypes.ASSIGNEE_SAVE_FAILED]: state =>
                addErrorFeedback(state, { message: i18n.t('Error updating the Assignee') }),

            [enrollmentEditEventActionTypes.ASSIGNEE_SAVE_FAILED]: state =>
                addErrorFeedback(state, { message: i18n.t('Error updating the Assignee') }),
        },
        'feedbacks',
        [],
    );
