// @flow

import { type Element } from 'react';

export type Props = {|
    list: { id: string, key: string, children: Element<any> }[],
    dataTest?: string,
    ...CssClasses,
|};
