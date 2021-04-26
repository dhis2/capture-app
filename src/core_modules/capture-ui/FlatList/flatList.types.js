// @flow

import { type Element } from 'react';

export type Props = {|
    list: any[],
    renderItem: (item: any) => Element<any>,
    className?: string,
    dataTest?: string,
|};
