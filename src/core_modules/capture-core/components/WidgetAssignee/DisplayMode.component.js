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
        fontSize: 14,
    },
    editButton: {
        marginLeft: spacers.dp12,
    },
    assignButton: {
        marginLeft: spacers.dp12,
    },
    avatarWrapper: {
        display: 'flex',
        alignItems: 'center',
    },
    avatar: {
        margin: spacers.dp4,
    },
});

type Props = {
    assignee: Assignee | null,
    onEdit: () => {},
    writeAccess: boolean,
    avatarId?: string,
    ...CssClasses,
};

const DisplayModePlain = ({ assignee, onEdit, writeAccess, avatarId, classes }: Props) => (
    assignee ? (
        <div className={classes.wrapper}>
            <div className={classes.avatarWrapper}>
                {i18n.t('Assigned to')}
                <UserAvatar name={assignee.name} className={classes.avatar} avatarId={avatarId} small />
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
                    small
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
                    secondary
                    disabled={!writeAccess}
                >
                    {i18n.t('Assign')}
                </Button>
            </ConditionalTooltip>
        </div>
    )
);

export const DisplayMode = withStyles(styles)(DisplayModePlain);
