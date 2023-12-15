// @flow
import type {
    PageLayoutConfig,
    WidgetConfig,
} from '../../common/EnrollmentOverviewDomain/EnrollmentPageLayout/DefaultEnrollmentLayout.types';
import {
    DefaultWidgetsForEnrollmentOverview,
    NewEventWorkspace,
    WidgetTypes,
} from '../../common/EnrollmentOverviewDomain/EnrollmentPageLayout';

export const WidgetsForEnrollmentEventNew: $ReadOnly<{ [key: string]: WidgetConfig }> = Object.freeze({
    NewEventWorkspace,
    ...DefaultWidgetsForEnrollmentOverview,
});

export const DefaultPageLayout: PageLayoutConfig = Object.freeze({
    leftColumn: [
        {
            type: WidgetTypes.COMPONENT,
            name: 'NewEventWorkspace',
        },
    ],
    rightColumn: [
        {
            type: WidgetTypes.COMPONENT,
            name: 'TrackedEntityRelationship',
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
            name: 'FeedbackWidget',
        },
        {
            type: WidgetTypes.COMPONENT,
            name: 'IndicatorWidget',
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
});
