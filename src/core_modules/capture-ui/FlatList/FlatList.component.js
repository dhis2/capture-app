// @flow
import React, { useCallback } from 'react';
import cx from 'classnames';
import classes from './FlatList.module.css';
import type { Props } from './flatList.types';

export const FlatList = ({ list, className, dataTest, renderItem, ...passOnProps }: Props) => {
   
    return (
        <div
            {...passOnProps}
            data-test={dataTest}
            className={cx(classes.button, className)}
        >
            {list.map((item, index) => {
                return (<div key={index}>{renderItem(item)}</div>)
            })}
        </div>
    );
};
