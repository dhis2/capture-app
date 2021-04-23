// @flow
import React from 'react';
import cx from 'classnames';
import uuid from 'uuid/v4';
import classes from './FlatList.module.css';
import type { Props } from './flatList.types';

export const FlatList = ({ list, className, dataTest, renderItem, ...passOnProps }: Props) => (
    <div
        {...passOnProps}
        data-test={dataTest}
        className={cx(classes.button, className)}
    >
        {list.map(item => (<div key={uuid()}>{renderItem(item)}</div>))}
    </div>
);
