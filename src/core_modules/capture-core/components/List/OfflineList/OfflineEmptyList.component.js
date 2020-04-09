// @flow
import React from 'react';
import { withStyles } from '@material-ui/core';
import { darken, fade, lighten } from '@material-ui/core/styles/colorManipulator';
import i18n from '@dhis2/d2-i18n';

const getStyles = theme => ({
    container: {
        borderColor: theme.palette.type === 'light'
            ? lighten(fade(theme.palette.divider, 1), 0.88)
            : darken(fade(theme.palette.divider, 1), 0.8),
        borderWidth: '1px',
        borderStyle: 'solid',
        padding: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

type Props = {
    classes: {
        container: string,
    }
};

const OfflineEmptyList = (props: Props) => (
    <div
        className={props.classes.container}
    >
        {props.emptyListText || i18n.t('Data for offline list not present')}
    </div>
);

export default withStyles(getStyles)(OfflineEmptyList);
