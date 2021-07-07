// @flow
import React from 'react';
import { withStyles } from '@material-ui/core';
import { ErrorRounded } from '@material-ui/icons';
import { spacers, colors } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';

const styles = {
    container: {
        display: 'flex',
        alignItems: 'center',
        gap: spacers.dp8,
        color: colors.red800,
        fontWeight: 500,
    },
    label: {
        margin: 0,
    },
};

const WidgetErrorHeaderPlain = ({ classes }) => (
    <span className={classes.container}>
        <ErrorRounded />
        <p className={classes.label}>{i18n.t('Error')}</p>
    </span>
);

export const WidgetErrorHeader = withStyles(styles)(WidgetErrorHeaderPlain);
