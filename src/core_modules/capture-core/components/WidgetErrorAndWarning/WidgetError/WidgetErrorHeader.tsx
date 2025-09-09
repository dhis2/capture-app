import React from 'react';
import { withStyles, type WithStyles } from '@material-ui/core';
import { spacers, colors, IconErrorFilled24 } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';

const styles: Readonly<any> = {
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

type Props = WithStyles<typeof styles>;

const WidgetErrorHeaderPlain = ({ classes }: Props) => (
    <span className={classes.container}>
        <IconErrorFilled24 />
        <p className={classes.label}>{i18n.t('Error')}</p>
    </span>
);

export const WidgetErrorHeader = withStyles(styles)(WidgetErrorHeaderPlain);
