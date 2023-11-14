// @flow
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { IconEdit24, Button, spacers } from '@dhis2/ui';
import { withStyles } from '@material-ui/core/styles';
import { ConditionalTooltip } from 'capture-core/components/ConditionalTooltip';
import type { Assignee } from './WidgetAssignee.types';

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
    assignButton: {
        margin: spacers.dp4,
    },
});

type Props = {
    assignee: Assignee | null,
    onEdit: () => {},
    writeAccess: boolean,
    ...CssClasses,
};

const DisplayModePlain = ({ assignee, onEdit, writeAccess, classes }: Props) => (
    assignee ? (
        <div className={classes.wrapper}>
            {i18n.t('Event assigned to {{name}}', { name: assignee.name })}
            <ConditionalTooltip
                content={i18n.t("You don't have access to edit this assignee")}
                enabled={!writeAccess}
            >
                <Button
                    onClick={onEdit}
                    className={classes.editButton}
                    dataTest="widget-assignee-edit"
                    disabled={!writeAccess}
                >
                    <IconEdit24 />
                </Button>
            </ConditionalTooltip>
        </div>
    ) : (
        <div className={classes.wrapper}>
            {i18n.t('No one is assigned to this event')}
            <ConditionalTooltip
                content={i18n.t("You don't have access to assign an assignee")}
                enabled={!writeAccess}
            >
                <Button
                    onClick={onEdit}
                    className={classes.assignButton}
                    dataTest="widget-assignee-assign"
                    small
                    disabled={!writeAccess}
                >
                    {i18n.t('Assign')}
                </Button>
            </ConditionalTooltip>
        </div>
    )
);

export const DisplayMode = withStyles(styles)(DisplayModePlain);
