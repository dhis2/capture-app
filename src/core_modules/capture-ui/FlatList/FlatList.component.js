// @flow
import React, { type ComponentType } from 'react';
import cx from 'classnames';
import { colors, spacersNum } from '@dhis2/ui';
import { withStyles } from '@material-ui/core';
import type { Props } from './flatList.types';

const itemStyles = {
    overflow: 'hidden',
    wordWrap: 'break-word',
    textOverflow: 'ellipsis',
    hyphens: 'auto',
};

const styles = {
    itemRow: {
        borderBottom: `1px solid ${colors.grey300}`,
        display: 'flex',
        fontSize: '14px',
        lineHeight: '19px',
        padding: `${spacersNum.dp12}px 0`,
        '&.isLastItem': {
            borderBottomWidth: 0,
        },
    },
    itemKey: {
        flex: '0 0 auto',
        width: '128px',
        color: colors.grey600,
        marginRight: '20px',
        ...itemStyles,
    },
    itemValue: {
        flex: 1,
        ...itemStyles,
    },
};

const FlatListPlain = ({ list, classes, dataTest }: Props) => {
    const lastItemKey = list[list.length - 1]?.reactKey;
    const renderItem = item => (
        <div
            key={item.reactKey}
            className={cx(classes.itemRow, { isLastItem: item.reactKey === lastItemKey })}
        >
            <div className={classes.itemKey}>{item.key}:</div>
            <div className={classes.itemValue}>{item.value}</div>
        </div>
    );

    return (
        <div data-test={dataTest}>
            {list.map(item => renderItem(item))}
        </div>
    );
};

export const FlatList: ComponentType<$Diff<Props, CssClasses>> = withStyles(styles)(FlatListPlain);
