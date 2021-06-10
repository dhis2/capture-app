// @flow
import type { Node } from 'react';

export type WidgetNonCollapsibleProps = {|
    header: Node,
    children: Node,
    color?: string,
|};

export type WidgetNonCollapsiblePropsPlain = {|
    ...WidgetNonCollapsibleProps,
    ...CssClasses,
|};
