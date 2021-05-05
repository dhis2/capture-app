// @flow
import { type Node } from 'react';

export type Props = {|
    list: { reactKey: string, key: string, value: Node }[],
    dataTest?: string,
    ...CssClasses,
|};
