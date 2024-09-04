import React, { type ComponentType } from 'react';
import { cx } from '@emotion/css';
import { colors, spacersNum } from '@dhis2/ui';
import { withStyles } from 'capture-core-utils/styles';
import type { Props } from './flatList.types';

const itemStyles = {
    overflow: 'hidden',
    wordWrap: 'break-word',
    textOverflow: 'ellipsis',
    hyphens: 'auto',
} as any;

const styles = {
    itemRow: {
        borderBottom: `1px solid ${colors.grey300}`,
        display: 'flex',
        fontSize: '14px',
        lineHeight: '19px',
        padding: `${spacersNum.dp8}px 0`,
        '&.isLastItem': {
            borderBottomWidth: 0,
        },
    },
    itemKey: {
        flex: '0 0 auto',
        width: '110px',
        color: colors.grey700,
        marginRight: spacersNum.dp8,
        fontSize: '13px',
        lineHeight: '17px',
        ...itemStyles,
    },
    itemValue: {
        flex: 1,
        ...itemStyles,
    },
} as any;

const FlatListPlain = ({ list, classes, dataTest }: Props) => {
    const lastItemKey = list[list.length - 1]?.reactKey;
    const renderItem = (item: any) => (
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

export const FlatList: ComponentType<any> = withStyles(styles)(FlatListPlain) as any;
