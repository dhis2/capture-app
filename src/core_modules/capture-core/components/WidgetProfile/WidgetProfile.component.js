// @flow
import React, { type ComponentType, useState, useCallback } from 'react';
import i18n from '@dhis2/d2-i18n';
import { FlatList } from 'capture-ui';
import { withStyles } from '@material-ui/core';
import { Widget } from '../Widget';
import { useWidgetProfileData } from './hooks';
import type { Props } from './widgetProfile.types';


const styles = {
    profileWidgetWrapper: {
        paddingBottom: '12px',
    },

};
const ProfileWidgetPlain = ({ classes }: Props) => {
    const attributes = useWidgetProfileData() ?? [];
    const [open, setOpenStatus] = useState(true);

    const formatAttributes = () => attributes.map(attribute => ({ id: attribute.id, key: attribute.displayName, children: <>{attribute.value}</> }));

    return (
        <div
            data-test="profile-widget"
            className={classes.profileWidgetWrapper}
        >
            <Widget
                header={i18n.t('Person Profile')}
                onOpen={useCallback(() => setOpenStatus(true), [setOpenStatus])}
                onClose={useCallback(() => setOpenStatus(false), [setOpenStatus])}
                open={open}
            >
                <FlatList
                    list={formatAttributes()}
                />
            </Widget>
        </div>
    );
};


export const WidgetProfile: ComponentType<$Diff<Props, CssClasses>> = withStyles(styles)(ProfileWidgetPlain);
