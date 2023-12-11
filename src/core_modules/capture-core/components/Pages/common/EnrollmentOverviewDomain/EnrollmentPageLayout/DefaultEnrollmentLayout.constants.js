// @flow

import {
    EnrollmentWidget,
    ErrorWidget,
    FeedbackWidget,
    IndicatorWidget,
    ProfileWidget,
    TrackedEntityRelationship,
    WarningWidget,
} from './LayoutComponentConfig';

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
