// @flow
import type { Node } from 'react';

export type WidgetNonCollapsibleProps = {|
    header: Node,
    children: Node,
    containerstyle?: ?{},
|};

export type WidgetNonCollapsiblePropsPlain = {|
    ...WidgetNonCollapsibleProps,
    ...CssClasses,
|};
