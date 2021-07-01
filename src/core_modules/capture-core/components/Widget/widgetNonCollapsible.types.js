// @flow
import type { Node } from 'react';

export type WidgetNonCollapsibleProps = {|
    header: Node,
    children: Node,
    color?: string,
    borderless?: boolean,
|};

export type WidgetNonCollapsiblePropsPlain = {|
    ...WidgetNonCollapsibleProps,
    ...CssClasses,
|};
