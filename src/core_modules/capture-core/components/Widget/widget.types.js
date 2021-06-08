// @flow
import type { WidgetCollapsibleProps } from './widgetCollapsible.types';
import type { WidgetNonCollapsibleProps } from './widgetNonCollapsible.types';

type CollapsibleProps = {|
    ...WidgetCollapsibleProps,
    className?: ?string,
    collapsible?: true,
|};

type NonCollapsibleProps = {|
    ...WidgetNonCollapsibleProps,
    className?: ?string,
    collapsible: false,
|};

export type Props = CollapsibleProps | NonCollapsibleProps;
