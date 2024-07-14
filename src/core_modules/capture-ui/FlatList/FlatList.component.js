
// @flow
import React, { type ComponentType } from 'react';
import cx from 'classnames';
import { colors, spacersNum } from '@dhis2/ui';
import { withStyles } from '@material-ui/core';
import type { Props } from './flatList.types';
import { TooltipOrgUnit } from '../../capture-core/components/Tooltips/TooltipOrgUnit/TooltipOrgUnit.component';
import { useOrgUnitNameWithAncestors, useFormatOrgUnitNameFullPath } from '../../capture-core/metadataRetrieval/orgUnitName';

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
    const renderItem = (item) => {
        const { displayName: orgUnitName, ancestors } = useOrgUnitNameWithAncestors(item.value.id);
        console.log('orgUnitNameassss', item);
        const orgUnitNameFullPath = useFormatOrgUnitNameFullPath(orgUnitName, ancestors);
        return (
            <div
                key={item.reactKey}
                className={cx(classes.itemRow, { isLastItem: item.reactKey === lastItemKey })}
            >
                <div className={classes.itemKey}>{item.key}:</div>
                <div className={classes.itemValue}>
                    {item.valueType === 'ORGANISATION_UNIT' ? (
                        <TooltipOrgUnit orgUnitName={orgUnitName} orgUnitNameFullPath={orgUnitNameFullPath} />
                    ) : (
                        item.value.name
                    )}
                </div>
            </div>
        );
    };

    return (
        <div data-test={dataTest}>
            {list.map(item => renderItem(item))}
        </div>
    );
};

export const FlatList: ComponentType<$Diff<Props, CssClasses>> = withStyles(styles)(FlatListPlain);
