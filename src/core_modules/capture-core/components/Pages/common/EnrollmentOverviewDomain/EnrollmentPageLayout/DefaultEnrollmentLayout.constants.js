// @flow
import i18n from '@dhis2/d2-i18n';
import {
    EnrollmentWidget,
    ErrorWidget,
    FeedbackWidget,
    IndicatorWidget,
    ProfileWidget,
    TrackedEntityRelationship,
    WarningWidget,
} from './LayoutComponentConfig';

export const EnrollmentPageKeys = Object.freeze({
    OVERVIEW: 'overview',
    NEW_EVENT: 'newEvent',
    EDIT_EVENT: 'editEvent',
    VIEW_EVENT: 'viewEvent',
});

export const DefaultPageTitle = {
    OVERVIEW: i18n.t('Dashboard'),
    NEW_EVENT: i18n.t('New Event'),
    EDIT_EVENT: i18n.t('Edit Event'),
    VIEW_EVENT: i18n.t('View Event'),
};

// Default components are available across all Enrollment Pages
export const DefaultWidgetsForEnrollmentOverview = {
    TrackedEntityRelationship,
    ErrorWidget,
    WarningWidget,
    FeedbackWidget,
    IndicatorWidget,
    ProfileWidget,
    EnrollmentWidget,
};
export const WidgetTypes = Object.freeze({
    COMPONENT: 'component',
    PLUGIN: 'plugin',
});

export const DataStoreKeyByPage = Object.freeze({
    ENROLLMENT_OVERVIEW: 'enrollmentOverviewLayout',
    ENROLLMENT_EVENT_NEW: 'enrollmentEventNewLayout',
    ENROLLMENT_EVENT_EDIT: 'enrollmentEventEditLayout',
});
