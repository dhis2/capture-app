import React, { type ComponentType } from 'react';
import i18n from '@dhis2/d2-i18n';
import { withStyles, Theme } from '@material-ui/core/styles';
import { UserField } from '../../FormFields/UserField/UserField.component';
import type { Props } from './Assignee.types';

const getStyles = (theme: Theme) => ({
    container: {
        display: 'flex',
        alignItems: 'baseline',
        padding: '8px 8px 8px 12px',
    },
    label: {
        fontSize: theme.typography.pxToRem(14),
        flexBasis: 200,
        color: theme.palette.text.primary,
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
                <UserField inputPlaceholderText={i18n.t('Search for user')} value={assignee} {...passOnProps} />
            </div>
        </div>
    );
};

export const Assignee = withStyles(getStyles)(AssigneePlain) as ComponentType<Omit<Props, 'classes'>>;
