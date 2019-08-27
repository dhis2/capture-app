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
    }
});

type Props = {
    classes: Object,
};

const Assignee = (props: Props) => {
    const { classes, ...passOnProps } = props;

    return (
        <div
            class={classes.container}
        >
            <div
                class={classes.label}
            >
                {i18n.t('Assigned user')}
            </div>
            <div
                class={classes.field}
            >
            <Username
                {...passOnProps}
            />
            </div>
        </div>
    );
};

export default withStyles(getStyles)(Assignee);
