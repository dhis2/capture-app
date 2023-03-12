// @flow
import { type Node } from 'react';

export type Props = {|
    sectionName: string,
    children: Node,
    dataTest?: string,
    ...CssClasses,
|};
