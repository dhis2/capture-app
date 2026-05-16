import React, { useCallback, useState } from 'react';
import i18n from '@dhis2/d2-i18n';
import { IconUser24 } from '@dhis2/ui';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import type { ApiEnrollmentEvent } from 'capture-core-utils/types/api-types';
import { ViewEventSection } from '../../Section/ViewEventSection.component';
import { ViewEventSectionHeader } from '../../Section/ViewEventSectionHeader.component';
import { DisplayMode } from '../../../../WidgetAssignee/DisplayMode.component';
import { EditMode } from '../../../../WidgetAssignee/EditMode.component';
import { useUserAvatar, useAssigneeMutation } from '../../../../WidgetAssignee/hooks';
import type { ProgramStage } from '../../../../../metaData';
import type { UserFormField } from '../../../../FormFields/UserField';

const getStyles = (theme: any) => ({
    badge: {
        backgroundColor: theme.palette.grey.light,
    },
});

const headerText = i18n.t('Assignee');

type Props = {
    assignee: UserFormField | null;
    programStage?: ProgramStage | null;
    eventAccess: {
        read: boolean;
        write: boolean;
    } | null;
    getAssignedUserSaveContext: () => { event: ApiEnrollmentEvent };
    onSaveAssignee: (newAssignee: UserFormField) => void;
    onSaveAssigneeError: (prevAssignee: UserFormField | null) => void;
} & WithStyles<typeof getStyles>;

const AssigneeSectionPlain = ({
    assignee,
    programStage,
    getAssignedUserSaveContext,
    eventAccess,
    onSaveAssignee,
    onSaveAssigneeError,
    classes,
}: Props) => {
    const [editMode, setEditMode] = useState(false);
    const { avatarId, isLoading } = useUserAvatar(assignee?.id);
    const onSet = useAssigneeMutation({
        assignee,
        getSaveContext: getAssignedUserSaveContext,
        onSave: onSaveAssignee,
        onSaveError: onSaveAssigneeError,
    });

    const handleSet = useCallback(
        (user: UserFormField) => {
            setEditMode(false);
            onSet(user);
        },
        [onSet],
    );

    if (!programStage?.enableUserAssignment) {
        return null;
    }

    if (isLoading) {
        return null;
    }

    return (
        <ViewEventSection
            collapsable
            header={(
                <ViewEventSectionHeader
                    icon={IconUser24}
                    text={headerText}
                    badgeClass={classes.badge}
                />
            )}
        >
            {editMode ? (
                <EditMode
                    onCancel={() => setEditMode(false)}
                    onSet={handleSet}
                    assignee={assignee}
                />
            ) : (
                <DisplayMode
                    assignee={assignee}
                    onEdit={() => setEditMode(true)}
                    readOnly={!eventAccess?.write}
                    avatarId={avatarId}
                />
            )}
        </ViewEventSection>
    );
};

export const AssigneeSection = withStyles(getStyles)(AssigneeSectionPlain);
