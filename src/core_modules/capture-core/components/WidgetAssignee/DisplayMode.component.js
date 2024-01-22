// @flow
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { Button, spacers, UserAvatar } from '@dhis2/ui';
import { withStyles } from '@material-ui/core/styles';
import { ConditionalTooltip } from 'capture-core/components/Tooltips/ConditionalTooltip';
import type { Assignee } from './WidgetAssignee.types';

const styles = () => ({
    wrapper: {
        display: 'flex',
        alignItems: 'center',
    },
    editButton: {
        margin: spacers.dp4,
    },
    assignButton: {
        margin: spacers.dp4,
    },
    avatar: {
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
            <div>
                {i18n.t('Assigned to')}
                <UserAvatar name={assignee.name} className={classes.avatar} />
                {assignee.name}
            </div>
            <ConditionalTooltip
                content={i18n.t("You don't have access to edit this assignee")}
                enabled={!writeAccess}
            >
                <Button
                    onClick={onEdit}
                    className={classes.editButton}
                    dataTest="widget-assignee-edit"
                    disabled={!writeAccess}
                    secondary
                >
                    {i18n.t('Edit')}
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
