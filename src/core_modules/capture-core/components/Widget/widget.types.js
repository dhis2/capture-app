// @flow
import type { WidgetNonCollapsibleProps } from './widgetNonCollapsible.types';
import type { WidgetCollapsibleProps } from './widgetCollapsible.types';

type CollapsibleProps = {|
    ...WidgetCollapsibleProps,
    noncollapsible?: false,
|};

type NonCollapsibleProps = {|
    ...WidgetNonCollapsibleProps,
    noncollapsible: true,
|};

export type Props = CollapsibleProps | NonCollapsibleProps;
