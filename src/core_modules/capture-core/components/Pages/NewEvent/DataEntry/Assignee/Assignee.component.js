// @flow
import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { withStyles } from '@material-ui/core/styles';
import Username from '../../../../FormFields/UserField/UserField.component';

const getStyles = () => ({
    container: {
        display: 'flex',
        alignItems: 'center',
        padding: 8,
    },
    label: {
        flexBasis: 200,
    },
    field: {
        flexBasis: 150,
        flexGrow: 1,
    },
});

type Props = {
    classes: Object,
};

const Assignee = (props: Props) => {
    const { classes, ...passOnProps } = props;

    return (
        <div
            className={classes.container}
        >
            <div
                className={classes.label}
            >
                {i18n.t('Assigned user')}
            </div>
            <div
                className={classes.field}
            >
                {/* $FlowFixMe[cannot-spread-inexact] automated comment */}
                <Username
                    inputPlaceholderText={i18n.t('Search for user')}
                    {...passOnProps}
                />
            </div>
        </div>
    );
};

export default withStyles(getStyles)(Assignee);
