// @flow
import type {
    PageLayoutConfig,
    WidgetConfig,
} from '../../common/EnrollmentOverviewDomain/EnrollmentPageLayout/DefaultEnrollmentLayout.types';
import {
    DefaultWidgetsForEnrollmentOverview,
    EditEventWorkspace,
    EventComment,
    AssigneeWidget,
    WidgetTypes, TwoEventWorkspace,
} from '../../common/EnrollmentOverviewDomain/EnrollmentPageLayout';

export const WidgetsForEnrollmentEventEdit: $ReadOnly<{ [key: string]: WidgetConfig }> = Object.freeze({
    EditEventWorkspace,
    TwoEventWorkspace,
    EventComment,
    AssigneeWidget,
    ...DefaultWidgetsForEnrollmentOverview,
});

export const DefaultPageLayout: PageLayoutConfig = {
    leftColumn: [
        {
            type: WidgetTypes.COMPONENT,
            name: 'TwoEventWorkspace',
        },
        {
            type: WidgetTypes.COMPONENT,
            name: 'EditEventWorkspace',
        },
    ],
    rightColumn: [
        {
            type: WidgetTypes.COMPONENT,
            name: 'AssigneeWidget',
        },
        {
            type: WidgetTypes.COMPONENT,
            name: 'ErrorWidget',
        },
        {
            type: WidgetTypes.COMPONENT,
            name: 'WarningWidget',
        },
        {
            type: WidgetTypes.COMPONENT,
            name: 'EventComment',
        },
        {
            type: WidgetTypes.COMPONENT,
            name: 'FeedbackWidget',
        },
        {
            type: WidgetTypes.COMPONENT,
            name: 'IndicatorWidget',
        },
        {
            type: WidgetTypes.COMPONENT,
            name: 'TrackedEntityRelationship',
        },
        {
            type: WidgetTypes.COMPONENT,
            name: 'ProfileWidget',
            settings: { readOnlyMode: true },
        },
        {
            type: WidgetTypes.COMPONENT,
            name: 'EnrollmentWidget',
            settings: { readOnlyMode: true },
        },
    ],
};
