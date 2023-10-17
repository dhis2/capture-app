// @flow
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { withStyles } from '@material-ui/core/styles';
import { UserField } from '../../FormFields/UserField/UserField.component';
import type { Props } from './Assignee.types';

const getStyles = () => ({
    container: {
        display: 'flex',
        alignItems: 'baseline',
        padding: '8px 8px 8px 12px',
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

const AssigneePlain = (props: Props) => {
    const { classes, assignee, ...passOnProps } = props;
    return (
        <div className={classes.container}>
            <div className={classes.label}>{i18n.t('Assignee')}</div>
            <div className={classes.field}>
                {/* $FlowFixMe[cannot-spread-inexact] automated comment */}
                <UserField inputPlaceholderText={i18n.t('Search for user')} value={assignee} {...passOnProps} />
            </div>
        </div>
    );
};

export const Assignee = withStyles(getStyles)(AssigneePlain);
