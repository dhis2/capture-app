// @flow
import { WidgetTypes } from './CustomEnrollmentPageLayout.constants';

type LeftColumnComponents = 'QuickActions' | 'StagesAndEvents';
type RightColumnComponents = 'TrackedEntityRelationship'
    | 'ErrorWidget'
    | 'WarningWidget'
    | 'FeedbackWidget'
    | 'IndicatorWidget'
    | 'Notes'
    | 'ProfileWidget'
    | 'EnrollmentWidget';

export type ColumnConfig = {
    type: $Values<typeof WidgetTypes>,
    name: LeftColumnComponents | RightColumnComponents,
}

export type CustomPageLayoutConfig = {
    leftColumn: ?Array<ColumnConfig>,
    rightColumn: ?Array<ColumnConfig>,
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
