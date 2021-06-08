// @flow
import type { Node } from 'react';

export type WidgetCollapsibleProps = {|
    header: Node,
    children: Node,
    open: boolean,
    onOpen: () => void,
    onClose: () => void,
    containerstyle?: ?{}
|};

export type WidgetCollapsiblePropsPlain = {|
    ...WidgetCollapsibleProps,
    ...CssClasses,
|};
