// @flow
import { type Node } from 'react';

export type Props = {|
    sectionName: string,
    fields: Array<{ label: string, children: Node}>,
    dataTest?: string,
    ...CssClasses,
|};
