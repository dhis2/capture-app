// @flow
import type { Node } from 'react';

export type WidgetNonCollapsibleProps = {|
    header: Node,
    children: Node,
|};

export type WidgetNonCollapsiblePropsPlain = {|
    ...WidgetNonCollapsibleProps,
    ...CssClasses,
|};
