// @flow
import React, { type ComponentType } from 'react';
import cx from 'classnames';
import { withStyles } from '@material-ui/core';
import { colors, spacersNum } from '@dhis2/ui';
import type { Props } from './flatList.types';


const styles = {
    flatListWrapper: {
        padding: `0 ${spacersNum.dp16}px`,
    },
    itemRow: {
        borderBottom: `1px solid${colors.grey400}`,
        display: 'flex',
        padding: `${spacersNum.dp16}px 0`,
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
    const lastItemKey = list[list.length - 1]?.reactKey;
    const renderItem = item => (
        <div
            key={item.reactKey}
            className={cx(classes.itemRow, { isLastItem: item.reactKey === lastItemKey })}
        >
            <div className={classes.itemKey}>{item.key}</div>
            <div>{item.value}</div>
        </div>
    );

    return (
        <div
            data-test={dataTest}
            className={classes.flatListWrapper}
        >
            {list.map(item => renderItem(item))}
        </div>
    );
};


export const FlatList: ComponentType<$Diff<Props, CssClasses>> = withStyles(styles)(FlatListPlain);
