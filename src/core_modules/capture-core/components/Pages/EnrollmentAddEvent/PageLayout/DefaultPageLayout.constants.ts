import type {
    PageLayoutConfig,
    WidgetConfig,
} from '../../common/EnrollmentOverviewDomain/EnrollmentPageLayout/DefaultEnrollmentLayout.types';
import {
    DefaultWidgetsForEnrollmentOverview,
    NewEventWorkspace,
    WidgetTypes,
} from '../../common/EnrollmentOverviewDomain/EnrollmentPageLayout';

export const WidgetsForEnrollmentEventNew: Readonly<{ [key: string]: WidgetConfig }> = Object.freeze({
    NewEventWorkspace,
    ...DefaultWidgetsForEnrollmentOverview,
});

export const DefaultPageLayout: PageLayoutConfig = {
    leftColumn: [
        {
            type: WidgetTypes.COMPONENT,
            name: 'NewEventWorkspace' as const,
        },
    ],
    rightColumn: [
        {
            type: WidgetTypes.COMPONENT,
            name: 'TrackedEntityRelationship' as const,
        },
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
            name: 'FeedbackWidget' as const,
        },
        {
            type: WidgetTypes.COMPONENT,
            name: 'IndicatorWidget' as const,
        },
        {
            type: WidgetTypes.COMPONENT,
            name: 'ProfileWidget' as const,
            settings: { readOnlyMode: true },
        },
        {
            type: WidgetTypes.COMPONENT,
            name: 'EnrollmentWidget' as const,
            settings: { readOnlyMode: true },
        },
    ],
};
