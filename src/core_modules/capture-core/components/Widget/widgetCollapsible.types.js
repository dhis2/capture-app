// @flow
import type { Node } from 'react';

export type WidgetCollapsibleProps = {|
    header: Node,
    children: Node,
    open: boolean,
    onOpen: () => void,
    onClose: () => void,
    color?: ?string,
|};

export type WidgetCollapsiblePropsPlain = {|
    ...WidgetCollapsibleProps,
    ...CssClasses,
|};
