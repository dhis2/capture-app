import React from 'react';
import cx from 'classnames';
import { colors, spacersNum } from '@dhis2/ui';
import { withStyles } from '@material-ui/core';
import { TooltipOrgUnit } from '../../capture-core/components/Tooltips/TooltipOrgUnit/TooltipOrgUnit.component';
import { useOrgUnitNameWithAncestors } from '../../capture-core/metadataRetrieval/orgUnitName';

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

const FlatListItem = ({ item, classes, lastItemKey }) => {
    const { displayName: orgUnitName, ancestors } = useOrgUnitNameWithAncestors(item.value?.id);

    return (
        <div
            key={item.reactKey}
            className={cx(classes.itemRow, { isLastItem: item.reactKey === lastItemKey })}
        >
            <div className={classes.itemKey}>{item.key}:</div>
            <div className={classes.itemValue}>
                {item.valueType === 'ORGANISATION_UNIT' ? (
                    <TooltipOrgUnit orgUnitName={orgUnitName} ancestors={ancestors} />
                ) : (
                    item.value?.name
                )}
            </div>
        </div>
    );
};

const FlatListPlain = ({ list, classes, dataTest }) => {
    const lastItemKey = list[list.length - 1]?.reactKey;

    return (
        <div data-test={dataTest}>
            {list.map(item => (
                <FlatListItem key={item.reactKey} item={item} classes={classes} lastItemKey={lastItemKey} />
            ))}
        </div>
    );
};

export const FlatList = withStyles(styles)(FlatListPlain);
