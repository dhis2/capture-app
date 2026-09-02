import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { Button, colors, spacers, spacersNum, UserAvatar } from '@dhis2/ui';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import type { Assignee } from './WidgetAssignee.types';
import { useTermLabel } from '../../metaData';
import { tCustomTerm } from '../../utils/tCustomTerm';

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
    programId?: string;
    stageId?: string;
} & WithStyles<typeof styles>;

const DisplayModePlain = ({ assignee, onEdit, readOnly = false, avatarId, programId, stageId, classes }: Props) => {
    const eventLabel = useTermLabel('event', { programId, stageId });
    if (assignee) {
        return (
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
        );
    }
    return (
        <div>
            <div className={classes.emptyMessage} data-test="widget-assignee-empty-message">
                {tCustomTerm('No one is assigned to this {{eventLabel}}', { eventLabel })}
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
