// @flow
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { IconEdit24, Button, spacers } from '@dhis2/ui';
import { withStyles } from '@material-ui/core/styles';
import type { UserFormField } from '../FormFields/UserField';

const styles = () => ({
    wrapper: {
        display: 'flex',
        alignItems: 'center',
    },
    editButton: {
        border: 'none !important',
        borderRadius: '50% !important',
        padding: '0px 6px !important',
        margin: spacers.dp4,
    },
});

type Props = {
    assignee: UserFormField | null,
    onEdit: () => {},
    ...CssClasses,
};

const DisplayModePlain = ({ assignee, onEdit, classes }: Props) => (
    assignee ? (
        <div className={classes.wrapper}>
            {i18n.t('Event assigned to {{name}}', { name: assignee.name })}
            <Button onClick={onEdit} className={classes.editButton} dataTest="widget-assignee-edit">
                <IconEdit24 />
            </Button>
        </div>
    ) : (
        <Button onClick={onEdit} small>
            {i18n.t('Assign')}
        </Button>
    )
);

export const DisplayMode = withStyles(styles)(DisplayModePlain);
