// @flow
import type { Node } from 'react';

export type WidgetCollapsibleProps = {|
    header: Node,
    children: Node,
    open: boolean,
    onOpen: () => void,
    onClose: () => void,
    containerstyle?: ?Object,
|};

export type WidgetCollapsiblePropsPlain = {|
    ...WidgetCollapsibleProps,
    ...CssClasses,
|};
