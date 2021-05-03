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
const plainStatus = Object.freeze({
    ACTIVE: 'ACTIVE',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED',
});

const translatedStatus = Object.freeze({
    [plainStatus.ACTIVE]: i18n.t('Active'),
    [plainStatus.COMPLETED]: i18n.t('Complete'),
    [plainStatus.CANCELLED]: i18n.t('Cancelled'),
});

export const StatusPlain = ({ status = '', classes }: Props) => (
    <>
        <Tag
            className={classes.status}
            dataTest="widget-enrollment-status"
            neutral={status === plainStatus.ACTIVE}
            negative={status === plainStatus.CANCELLED}
        >
            {translatedStatus[status] || status}
        </Tag>
    </>
);

export const Status: ComponentType<$Diff<Props, CssClasses>> = withStyles(
    styles,
)(StatusPlain);
