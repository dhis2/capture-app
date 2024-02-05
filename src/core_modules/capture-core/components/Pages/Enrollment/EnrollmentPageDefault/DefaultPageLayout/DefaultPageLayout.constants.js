// @flow
import {
    QuickActions,
    StagesAndEvents,
    EnrollmentComment,
    DefaultWidgetsForEnrollmentOverview,
    WidgetTypes,
} from '../../../common/EnrollmentOverviewDomain/EnrollmentPageLayout';
import type {
    PageLayoutConfig,
    WidgetConfig,
} from '../../../common/EnrollmentOverviewDomain/EnrollmentPageLayout/DefaultEnrollmentLayout.types';

export const WidgetsForEnrollmentPageDefault: $ReadOnly<{ [key: string]: WidgetConfig }> = Object.freeze({
    QuickActions,
    StagesAndEvents,
    EnrollmentComment,
    ...DefaultWidgetsForEnrollmentOverview,
});

export const DefaultPageLayout: PageLayoutConfig = Object.freeze({
    leftColumn: [
        {
            type: WidgetTypes.COMPONENT,
            name: 'QuickActions',
        },
        {
            type: WidgetTypes.COMPONENT,
            name: 'StagesAndEvents',
        },
    ],
    rightColumn: [
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
            name: 'EnrollmentComment',
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
            settings: { readOnlyMode: false },
        },
        {
            type: WidgetTypes.COMPONENT,
            name: 'EnrollmentWidget',
            settings: { readOnlyMode: false },
        },
    ],
});
