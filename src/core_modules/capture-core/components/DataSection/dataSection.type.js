// @flow
import { type Node } from 'react';

export type Props = {|
    sectionName: string,
    children: Node,
    dataTest?: string,
    error?: boolean,
    warning?: boolean,
    errorMessage?: string,
    ...CssClasses,
|};
