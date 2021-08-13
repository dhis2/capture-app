// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';

const getStyles = theme => ({
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
    classes: {
        container: string,
    }
};

const Index = (props: Props) => (
    <div
        className={props.classes.container}
    >
        {
            // $FlowFixMe[incompatible-type] automated comment
            // $FlowFixMe[prop-missing] automated comment
            props.emptyListText || i18n.t('Data for offline list not present')}
    </div>
);

export const OfflineEmptyList = withStyles(getStyles)(Index);
