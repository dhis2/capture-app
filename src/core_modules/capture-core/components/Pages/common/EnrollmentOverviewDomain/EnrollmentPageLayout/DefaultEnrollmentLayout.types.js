// @flow


import { WidgetTypes } from './DefaultEnrollmentLayout.constants';

type DefaultComponents = 'QuickActions'
    | 'StagesAndEvents'
    | 'TrackedEntityRelationship'
    | 'ErrorWidget'
    | 'WarningWidget'
    | 'FeedbackWidget'
    | 'IndicatorWidget'
    | 'Notes'
    | 'ProfileWidget'
    | 'EnrollmentWidget';

export type ColumnConfig = {
    type: $Values<typeof WidgetTypes>,
    name: DefaultComponents,
    settings?: Object,
}

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
