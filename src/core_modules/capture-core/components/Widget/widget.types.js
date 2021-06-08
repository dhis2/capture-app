// @flow
import type { WidgetCollapsibleProps } from './widgetCollapsible.types';
import type { WidgetNonCollapsibleProps } from './widgetNonCollapsible.types';

type CollapsibleProps = {|
    ...WidgetCollapsibleProps,
    color?: ?string,
    collapsible?: true,
|};

type NonCollapsibleProps = {|
    ...WidgetNonCollapsibleProps,
    color?: ?string,
    collapsible: false,
|};

export type Props = CollapsibleProps | NonCollapsibleProps;
