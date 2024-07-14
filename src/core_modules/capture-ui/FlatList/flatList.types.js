// @flow
import { type Node } from 'react';

export type Props = {|
    //value er et object som har en id og en name
    list: { reactKey: string, key: string, value: { id: string, name: string }, valueType?: string }[],
    dataTest?: string,
    ...CssClasses,
|};
