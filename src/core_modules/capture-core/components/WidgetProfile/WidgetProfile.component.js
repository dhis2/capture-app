// @flow
import React, { type ComponentType, useState, useCallback } from 'react';
import i18n from '@dhis2/d2-i18n';
import { FlatList } from 'capture-ui';
import cx from 'classnames';
import { withStyles } from '@material-ui/core';
import { colors } from '@dhis2/ui';
import { Widget } from '../Widget';
import type { Props } from './widgetProfile.types';
import { useProfileInfo } from './hooks';

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
const ProfileWidgetPlain = ({ classes }: Props) => {
    const { attributes } = useProfileInfo();
    const [open, setOpenStatus] = useState(true);
    const lastItem = attributes[attributes.length - 1];

    const renderAttributeItem = item => (
        <div className={cx(classes.itemRow, { isLastItem: item.attribute === lastItem.attribute })}>
            <div className={classes.itemKey}>{item.displayName}</div>
            <div>{item.value}</div>
        </div>
    );
    return (
        <div
            data-test="profile-widget"
        >
            <Widget
                header={i18n.t('Person Profile')}
                onOpen={useCallback(() => setOpenStatus(true), [setOpenStatus])}
                onClose={useCallback(() => setOpenStatus(false), [setOpenStatus])}
                open={open}
            >
                <FlatList
                    list={attributes ?? []}
                    renderItem={renderAttributeItem}
                    className={cx(classes.flatListWrapper)}
                />
            </Widget>
        </div>
    );
};


export const WidgetProfile: ComponentType<$Diff<Props, CssClasses>> = withStyles(styles)(ProfileWidgetPlain);
