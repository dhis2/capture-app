// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { darken, fade, lighten } from '@material-ui/core/styles/colorManipulator';
import { getTranslation } from '../../../../d2/d2Instance';
import { formatterOptions } from '../../../../utils/string/format.const';

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

const OfflineEmptyEventsList = (props: Props) => (
    <div
        className={props.classes.container}
    >
        {getTranslation('data_for_offline_event_list_not_present', formatterOptions.CAPITALIZE_FIRST_LETTER)}
    </div>
);

export default withStyles(getStyles)(OfflineEmptyEventsList);
