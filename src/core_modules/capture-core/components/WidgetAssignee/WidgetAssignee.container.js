// @flow
import React, { useCallback, useRef } from 'react';
import { useDataMutation } from '@dhis2/app-runtime';
import type { Props, Assignee } from './WidgetAssignee.types';
import { WidgetAssigneeComponent } from './WidgetAssignee.component';
import { convertClientToServer } from './converter';

const WidgetAssigneeWithHooks = (props: Props) => {
    const { assignee, writeAccess, onGetSaveContext, onSave, onSaveError } = props;
    const prevAssignee = useRef(assignee);

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
            const { event } = onGetSaveContext();
            prevAssignee.current = assignee;
            onSave(newAssignee);
            await updateMutation({ ...event, assignedUser: convertClientToServer(newAssignee) });
        },
        [updateMutation, onGetSaveContext, onSave, assignee],
    );

    return <WidgetAssigneeComponent assignee={assignee} writeAccess={writeAccess} onSet={onSet} />;
};

export const WidgetAssignee = (props: Props) => {
    if (!props.enabled) {
        return null;
    }

    return <WidgetAssigneeWithHooks {...props} />;
};
