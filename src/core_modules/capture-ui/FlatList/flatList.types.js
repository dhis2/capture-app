// @flow

import * as React from 'react';

export type Props = {
    list: any[],
    renderItem: (item: any) => React.Element<any>,
    className?: string,
    dataTest?: string,
};
