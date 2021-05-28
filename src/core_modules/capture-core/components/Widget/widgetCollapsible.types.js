// @flow
import type { Node } from 'react';

export type WidgetCollapsibleProps = {|
    header: Node,
    children: Node,
    open: boolean,
    onOpen: () => void,
    onClose: () => void,
|};

export type WidgetCollapsiblePropsPlain = {|
    ...WidgetCollapsibleProps,
    ...CssClasses,
|};
