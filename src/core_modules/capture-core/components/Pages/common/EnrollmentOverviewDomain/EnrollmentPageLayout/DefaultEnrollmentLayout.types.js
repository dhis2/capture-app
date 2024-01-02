// @flow


import { WidgetTypes } from './DefaultEnrollmentLayout.constants';

type DefaultComponents = 'QuickActions'
    | 'StagesAndEvents'
    | 'NewEventWorkspace'
    | 'EditEventWorkspace'
    | 'EnrollmentComment'
    | 'EventComment'
    | 'TrackedEntityRelationship'
    | 'ErrorWidget'
    | 'WarningWidget'
    | 'FeedbackWidget'
    | 'IndicatorWidget'
    | 'ProfileWidget'
    | 'EnrollmentWidget';

export type DefaultWidgetColumnComfig = {
    type: typeof WidgetTypes.COMPONENT,
    name: DefaultComponents,
    settings?: Object,
}

export type PluginWidgetColumnConfig = {
    type: typeof WidgetTypes.PLUGIN,
    source: string,
}

export type ColumnConfig = DefaultWidgetColumnComfig | PluginWidgetColumnConfig;

export type PageLayoutConfig = {
    title: ?string,
    leftColumn: ?Array<ColumnConfig>,
    rightColumn: ?Array<ColumnConfig>,
}

export type DefaultPageLayoutConfig = $Exact<PageLayoutConfig>;

export type WidgetConfig = {
    Component: React$ComponentType<any>,
    shouldHideWidget?: (props: Object) => boolean,
    getProps: Function,
    getCustomSettings?: Function,
};
