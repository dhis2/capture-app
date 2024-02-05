// @flow
import React, { useCallback, useRef } from 'react';
import { useDataMutation } from '@dhis2/app-runtime';
import type { Props, Assignee } from './WidgetAssignee.types';
import { WidgetAssigneeComponent } from './WidgetAssignee.component';
import { convertClientToServer } from './converter';
import { useUserAvatar } from './hooks';

const WidgetAssigneeWithHooks = (props: Props) => {
    const { assignee, writeAccess, getSaveContext, onSave, onSaveError } = props;
    const prevAssignee = useRef(assignee);
    const { avatarId, isLoading } = useUserAvatar(assignee?.id);

    const [updateMutation] = useDataMutation(
        {
            resource: 'tracker?async=false&importStrategy=UPDATE',
            type: 'create',
            data: event => ({ events: [event] }),
        },
        {
            onError: () => {
                onSaveError(prevAssignee.current);
            },
        },
    );

    const onSet = useCallback(
        async (newAssignee: Assignee) => {
            const { event } = getSaveContext();
            prevAssignee.current = assignee;
            onSave(newAssignee);
            await updateMutation({ ...event, assignedUser: convertClientToServer(newAssignee) });
        },
        [updateMutation, getSaveContext, onSave, assignee],
    );

    if (isLoading) {
        return null;
    }

    return <WidgetAssigneeComponent assignee={assignee} writeAccess={writeAccess} avatarId={avatarId} onSet={onSet} />;
};

export const WidgetAssignee = (props: Props) => {
    if (!props.enabled) {
        return null;
    }

    return <WidgetAssigneeWithHooks {...props} />;
};
