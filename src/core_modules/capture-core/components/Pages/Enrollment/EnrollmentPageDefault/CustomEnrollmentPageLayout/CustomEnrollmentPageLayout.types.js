// @flow

type LeftColumnComponents = 'QuickActions' | 'StagesAndEvents';
type RightColumnComponents = 'TrackedEntityRelationship'
    | 'ErrorWidget'
    | 'WarningWidget'
    | 'FeedbackWidget'
    | 'IndicatorWidget'
    | 'Notes'
    | 'ProfileWidget'
    | 'EnrollmentWidget';

type ColumnConfig = {
    type: 'component' | 'plugin',
    component: LeftColumnComponents | RightColumnComponents,
}

export type CustomPageLayoutConfig = {
    leftColumn: Array<ColumnConfig>,
    rightColumn: Array<ColumnConfig>,
}

export type WidgetConfig = {
    Component: React$ComponentType<any>,
    shouldHideWidget?: (props: Object) => boolean,
    getProps: Function,
};

export type Props = {
    customPageLayoutConfig: CustomPageLayoutConfig,
    ...CssClasses,
}
