// @flow
import React from 'react';
import uuid from 'uuid/v4';
import type { Props } from './flatList.types';

export const FlatList = ({ list, className, dataTest, renderItem }: Props) => (
    <div
        data-test={dataTest}
        className={className}
    >
        {list.map(item => (<div key={uuid()}>{renderItem(item)}</div>))}
    </div>
);
