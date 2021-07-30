// @flow
import React from 'react';
import { withStyles } from '@material-ui/core';
import { colors } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import type { Management } from '../../WidgetManagements.types';

type Props = {|
    management: Management,
    ...CssClasses
|}

const styles = {
    container: {
        borderTop: `1px ${colors.grey300} solid`,
        padding: '10px 0',
        display: 'flex',
        gap: '10px',
    },
    label: {
        color: colors.grey600,
    },
};

const ManagementExpandedContentPlain = ({ management, classes }: Props) => (
    <div className={classes.container}>
        <div>
            <p className={classes.label}>Management Title</p>
            <p>{management.displayName}</p>
            <p className={classes.label}>Reason</p>
            <p>{management.reason}</p>
        </div>
        <div>
            <p className={classes.label}>{i18n.t('Generation date')}</p>
            <p className={classes.label}>{i18n.t('Priority')}</p>
        </div>
    </div>
);

export const ManagementExpandedContent = withStyles(styles)(ManagementExpandedContentPlain);
