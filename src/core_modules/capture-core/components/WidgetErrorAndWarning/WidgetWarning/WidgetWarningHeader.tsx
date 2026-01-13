import { colors, spacers, IconWarningFilled24 } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import React from 'react';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';

const styles: Readonly<any> = {
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

type Props = WithStyles<typeof styles>;

const WidgetWarningHeaderPlain = ({ classes }: Props) => (
    <span className={classes.container}>
        <IconWarningFilled24 />
        <p className={classes.label}>{i18n.t('Warning')}</p>
    </span>
);

export const WidgetWarningHeader = withStyles(styles)(WidgetWarningHeaderPlain);
