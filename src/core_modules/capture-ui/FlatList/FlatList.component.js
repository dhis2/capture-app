// @flow
import React, { type ComponentType } from 'react';
import cx from 'classnames';
import { colors } from '@dhis2/ui';
import { withStyles } from '@material-ui/core';
import type { Props } from './flatList.types';


const styles = {
    flatListWrapper: {
        padding: '0 16px',
    },
    itemRow: {
        borderBottom: `1px solid${colors.grey400}`,
        display: 'flex',
        padding: '16px 0',
        '&.isLastItem': {
            borderBottomWidth: 0,
        },
    },
    itemKey: {
        width: 150,
        color: colors.grey600,
    },
};

const FlatListPlain = ({ list, classes, dataTest }: Props) => {
    const lastItem = list[list.length - 1];
    const renderItem = item => (
        <>
            <div className={classes.itemKey}>{item.key}</div>
            <div>{item.children}</div>
        </>
    );

    return (
        <div
            data-test={dataTest}
            className={classes.flatListWrapper}
        >
            {list.map(item => (<div key={item.id} className={cx(classes.itemRow, { isLastItem: item.id === lastItem.id })}>{renderItem(item)}</div>))}
        </div>
    );
};


export const FlatList: ComponentType<$Diff<Props, CssClasses>> = withStyles(styles)(FlatListPlain);
