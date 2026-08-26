import { useCallback, useRef } from 'react';
import { useDataMutation } from '@dhis2/app-runtime';
import { convertClientToServer } from '../converter';
import type { Assignee } from '../WidgetAssignee.types';

type Options = {
    assignee: Assignee | null;
    getSaveContext: () => { event: Record<string, unknown> };
    onSave: (newAssignee: Assignee) => void;
    onSaveError: (prevAssignee: Assignee | null) => void;
};

export const useAssigneeMutation = ({ assignee, getSaveContext, onSave, onSaveError }: Options) => {
    const prevAssignee = useRef(assignee);

    const [updateMutation] = useDataMutation(
        {
            resource: 'tracker?async=false&importStrategy=UPDATE',
            type: 'create',
            data: (event: Record<string, unknown>) => ({ events: [event] }),
        },
        {
            onError: () => {
                onSaveError(prevAssignee.current);
            },
        },
    );

    return useCallback(
        async (newAssignee: Assignee) => {
            const { event } = getSaveContext();
            prevAssignee.current = assignee;
            onSave(newAssignee);
            await updateMutation({ ...event, assignedUser: convertClientToServer(newAssignee) });
        },
        [updateMutation, getSaveContext, onSave, assignee],
    );
};
