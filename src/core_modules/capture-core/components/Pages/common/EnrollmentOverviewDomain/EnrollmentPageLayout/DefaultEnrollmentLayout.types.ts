import { WidgetTypes } from './DefaultEnrollmentLayout.constants';

type DefaultComponents = 'QuickActions'
    | 'StagesAndEvents'
    | 'AssigneeWidget'
    | 'NewEventWorkspace'
    | 'EditEventWorkspace'
    | 'RelatedStagesWorkspace'
    | 'EnrollmentNote'
    | 'EventNote'
    | 'TrackedEntityRelationship'
    | 'ErrorWidget'
    | 'WarningWidget'
    | 'FeedbackWidget'
    | 'IndicatorWidget'
    | 'ProfileWidget'
    | 'EnrollmentWidget';

export type DefaultWidgetColumnConfig = {
    type: typeof WidgetTypes.COMPONENT,
    name: DefaultComponents,
    settings?: Record<string, any>,
}

export type PluginWidgetColumnConfig = {
    type: typeof WidgetTypes.PLUGIN,
    source: string,
}

export type ColumnConfig = DefaultWidgetColumnConfig | PluginWidgetColumnConfig;

export type PageLayoutConfig = {
    title?: string | null,
    backgroundColor?: string | null,
    leftColumn: Array<ColumnConfig> | null,
    rightColumn: Array<ColumnConfig> | null,
}

export type WidgetConfig = {
    Component: React.ComponentType<any>,
    shouldHideWidget?: (props: Record<string, any>) => boolean,
    getProps: (...args: any[]) => any,
    getCustomSettings?: (...args: any[]) => any,
};
