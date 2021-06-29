// @flow

import { colors, spacers } from '@dhis2/ui';
import { WarningRounded } from '@material-ui/icons';
import i18n from '@dhis2/d2-i18n';
import React from 'react';
import { withStyles } from '@material-ui/core';

const styles = {
    container: {
        display: 'flex',
        alignItems: 'center',
        gap: spacers.dp8,
        color: colors.yellow900,
    },
    label: {
        margin: 0,
    },
};

const WidgetWarningHeaderPlain = ({ classes }) => (
    <span className={classes.container}>
        <WarningRounded />
        <p className={classes.label}>{i18n.t('Warning')}</p>
    </span>
);

export const WidgetWarningHeader = withStyles(styles)(WidgetWarningHeaderPlain);
