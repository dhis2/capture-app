// @flow
import type { WidgetCollapsibleProps } from './widgetCollapsible.types';
import type { WidgetNonCollapsibleProps } from './widgetNonCollapsible.types';

type CollapsibleProps = {|
    ...WidgetCollapsibleProps,
    collapsible?: true,
|};

type NonCollapsibleProps = {|
    ...WidgetNonCollapsibleProps,
    collapsible: false,
|};

export type Props = CollapsibleProps | NonCollapsibleProps;
