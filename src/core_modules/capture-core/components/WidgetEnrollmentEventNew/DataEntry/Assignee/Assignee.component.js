// @flow
import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { withStyles } from '@material-ui/core/styles';
import { UserField } from '../../../FormFields/UserField/UserField.component';

const getStyles = () => ({
    container: {
        display: 'flex',
        alignItems: 'baseline',
        padding: '8px 8px 8px 12px',
    },
    containerVertical: {
        display: 'flex',
        flexDirection: 'column',
        margin: 8,
    },
    label: {
        fontSize: 14,
        flexBasis: 200,
        color: '#212934',
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

const AssigneePlain = (props: Props) => {
    const { classes, orientation, ...passOnProps } = props;
    return (
        <div className={orientation === 'horizontal' ? classes.container : classes.containerVertical}>
            <div className={orientation === 'horizontal' && classes.label}>
                {i18n.t('Assigned user')}
            </div>
            <div className={orientation === 'horizontal' && classes.field}>
                {/* $FlowFixMe[cannot-spread-inexact] automated comment */}
                <UserField inputPlaceholderText={i18n.t('Search for user')} {...passOnProps} />
            </div>
        </div>);
};

export const Assignee = withStyles(getStyles)(AssigneePlain);
