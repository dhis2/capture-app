import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { Button, colors, spacers, spacersNum, UserAvatar } from '@dhis2/ui';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { useStageLabel } from '../../metaData';
import type { Assignee } from './WidgetAssignee.types';

const styles = () => ({
    wrapper: {
        display: 'flex',
        alignItems: 'center',
        fontSize: 14,
    },
    emptyMessage: {
        fontSize: 14,
        color: colors.grey600,
        paddingBottom: spacersNum.dp8,
    },
    editButton: {
        marginInlineStart: spacers.dp12,
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
    assignee: Assignee | null;
    onEdit: () => void;
    readOnly?: boolean;
    avatarId?: string;
} & WithStyles<typeof styles>;

const DisplayModePlain = ({ assignee, onEdit, readOnly = false, avatarId, classes }: Props) => {
    const event = useStageLabel('event') ?? i18n.t('event');

    return assignee ? (
        <div className={classes.wrapper}>
            <div className={classes.avatarWrapper}>
                {i18n.t('Assigned to')}
                <UserAvatar name={assignee.name} className={classes.avatar} avatarId={avatarId} small />
                {assignee.name}
            </div>
            {!readOnly && (
                <Button
                    onClick={onEdit}
                    className={classes.editButton}
                    dataTest="widget-assignee-edit"
                    secondary
                    small
                >
                    {i18n.t('Edit')}
                </Button>
            )}
        </div>
    ) : (
        <div>
            <div className={classes.emptyMessage} data-test="widget-assignee-empty-message">
                {i18n.t('No one is assigned to this {{event}}', {
                    event,
                    interpolation: { escapeValue: false },
                })}
            </div>
            {!readOnly && (
                <Button
                    onClick={onEdit}
                    dataTest="widget-assignee-assign"
                    small
                    secondary
                >
                    {i18n.t('Assign')}
                </Button>
            )}
        </div>
    );
};

export const DisplayMode = withStyles(styles)(DisplayModePlain);
