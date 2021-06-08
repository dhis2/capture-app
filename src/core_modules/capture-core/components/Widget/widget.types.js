// @flow
import type { WidgetCollapsibleProps } from './widgetCollapsible.types';
import type { WidgetNonCollapsibleProps } from './widgetNonCollapsible.types';

type CollapsibleProps = {|
    ...WidgetCollapsibleProps,
    className?: ?any,
    collapsible?: true,
|};

type NonCollapsibleProps = {|
    ...WidgetNonCollapsibleProps,
    className?: ?any,
    collapsible: false,
|};

export type Props = CollapsibleProps | NonCollapsibleProps;
