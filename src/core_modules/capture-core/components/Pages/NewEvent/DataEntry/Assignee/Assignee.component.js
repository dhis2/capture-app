// @flow
import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { withStyles } from '@material-ui/core/styles';
import Username from '../../../../FormFields/UserField/UserField.component';

const getStyles = () => ({
    container: {
        display: 'flex',
        alignItems: 'center',
        padding: '8px 8px 8px 12px',
    },
    containerVertical: {
        display: 'flex',
        flexDirection: 'column',
        margin: 8,
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
    orientation: string
};

const Assignee = (props: Props) => {
    const { classes, orientation, ...passOnProps } = props;
    return (
        <div className={orientation === 'horizontal' ? classes.container : classes.containerVertical}>
            <div className={orientation === 'horizontal' && classes.label}>
                {i18n.t('Assigned user')}
            </div>
            <div className={orientation === 'horizontal' && classes.field}>
                {/* $FlowFixMe[cannot-spread-inexact] automated comment */}
                <Username inputPlaceholderText={i18n.t('Search for user')} {...passOnProps} />
            </div>
        </div>);
};

export default withStyles(getStyles)(Assignee);
