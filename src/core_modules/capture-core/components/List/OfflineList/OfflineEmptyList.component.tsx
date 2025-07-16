import React from 'react';
import { withStyles, type WithStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';

const getStyles = (theme: any) => ({
    container: {
        borderColor: theme.palette.type === 'light'
            ? theme.palette.dividerLighter
            : theme.palette.dividerDarker,
        borderWidth: '1px',
        borderStyle: 'solid',
        padding: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

type Props = {
    emptyListText?: string;
} & WithStyles<typeof getStyles>;

const Index = (props: Props) => (
    <div
        className={props.classes.container}
    >
        {props.emptyListText || i18n.t('Data for offline list not present')}
    </div>
);

export const OfflineEmptyList = withStyles(getStyles)(Index);
