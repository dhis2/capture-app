// @flow
import type { WidgetCollapsibleProps } from './widgetCollapsible.types';
import type { WidgetNonCollapsibleProps } from './widgetNonCollapsible.types';

type CollapsibleProps = {|
    ...WidgetCollapsibleProps,
    noncollapsible?: false,
|};

type NonCollapsibleProps = {|
    ...WidgetNonCollapsibleProps,
    noncollapsible: true,
|};

export type Props = CollapsibleProps | NonCollapsibleProps;
