// @flow
import type { Node } from 'react';

export type WidgetNonCollapsibleProps = {|
    header: Node,
    children: Node,
    containerstyle?: ?Object,
|};

export type WidgetNonCollapsiblePropsPlain = {|
    ...WidgetNonCollapsibleProps,
    ...CssClasses,
|};
