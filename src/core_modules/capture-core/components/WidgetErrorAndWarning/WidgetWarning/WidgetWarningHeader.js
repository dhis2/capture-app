// @flow

import { colors, spacers, IconWarningFilled24 } from '@dhis2/ui';
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
        <IconWarningFilled24 />
        <p className={classes.label}>{i18n.t('Warning')}</p>
    </span>
);

export const WidgetWarningHeader = withStyles(styles)(WidgetWarningHeaderPlain);
