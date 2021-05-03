// @flow
import React, { type ComponentType } from 'react';
import i18n from '@dhis2/d2-i18n';
import { withStyles } from '@material-ui/core';
import { spacersNum, Tag } from '@dhis2/ui';
import type { Props } from './status.types';

const styles = {
    status: {
        margin: spacersNum.dp4,
    },
};

const status = Object.freeze({
    ACTIVE: i18n.t('Active'),
    COMPLETED: i18n.t('Complete'),
    CANCELLED: i18n.t('Cancelled'),
});

export const translateStatus = (status: string) => {
    return (
        Object.keys(status).find((key) => {
            console.log(key, status)
            return key === status;
        }) || status
    );
};

export const StatusPlain = ({ status = '', classes }: Props) => (
    <>
        <Tag
            className={classes.status}
            dataTest="widget-enrollment-status"
            neutral={status === 'ACTIVE'}
            negative={status === 'CANCELLED'}
        >
            {translateStatus(status)}
        </Tag>
    </>
);

export const Status: ComponentType<$Diff<Props, CssClasses>> = withStyles(
    styles,
)(StatusPlain);
