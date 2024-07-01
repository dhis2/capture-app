// @flow


import { WidgetTypes } from './DefaultEnrollmentLayout.constants';

type DefaultComponents = 'QuickActions'
    | 'StagesAndEvents'
    | 'AssigneeWidget'
    | 'NewEventWorkspace'
    | 'EditEventWorkspace'
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
    settings?: Object,
}

export type PluginWidgetColumnConfig = {
    type: typeof WidgetTypes.PLUGIN,
    source: string,
}

export type ColumnConfig = DefaultWidgetColumnConfig | PluginWidgetColumnConfig;

export type PageLayoutConfig = {
    title?: ?string,
    leftColumn: ?Array<ColumnConfig>,
    rightColumn: ?Array<ColumnConfig>,
}

export type WidgetConfig = {
    Component: React$ComponentType<any>,
    shouldHideWidget?: (props: Object) => boolean,
    getProps: Function,
    getCustomSettings?: Function,
};
