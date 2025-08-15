import {
    QuickActions,
    StagesAndEvents,
    EnrollmentNote,
    DefaultWidgetsForEnrollmentOverview,
    WidgetTypes,
} from '../../../common/EnrollmentOverviewDomain/EnrollmentPageLayout';
import type {
    PageLayoutConfig,
    WidgetConfig,
} from '../../../common/EnrollmentOverviewDomain/EnrollmentPageLayout/DefaultEnrollmentLayout.types';

export const WidgetsForEnrollmentPageDefault: Readonly<Record<string, WidgetConfig>> = Object.freeze({
    QuickActions,
    StagesAndEvents,
    EnrollmentNote,
    ...DefaultWidgetsForEnrollmentOverview,
});

export const DefaultPageLayout: PageLayoutConfig = {
    leftColumn: [
        {
            type: WidgetTypes.COMPONENT,
            name: 'QuickActions' as const,
        },
        {
            type: WidgetTypes.COMPONENT,
            name: 'StagesAndEvents' as const,
        },
    ],
    rightColumn: [
        {
            type: WidgetTypes.COMPONENT,
            name: 'ErrorWidget' as const,
        },
        {
            type: WidgetTypes.COMPONENT,
            name: 'WarningWidget' as const,
        },
        {
            type: WidgetTypes.COMPONENT,
            name: 'EnrollmentNote' as const,
        },
        {
            type: WidgetTypes.COMPONENT,
            name: 'FeedbackWidget' as const,
        },
        {
            type: WidgetTypes.COMPONENT,
            name: 'IndicatorWidget' as const,
        },
        {
            type: WidgetTypes.COMPONENT,
            name: 'TrackedEntityRelationship' as const,
        },
        {
            type: WidgetTypes.COMPONENT,
            name: 'ProfileWidget' as const,
            settings: { readOnlyMode: false },
        },
        {
            type: WidgetTypes.COMPONENT,
            name: 'EnrollmentWidget' as const,
            settings: { readOnlyMode: false },
        },
    ],
};
