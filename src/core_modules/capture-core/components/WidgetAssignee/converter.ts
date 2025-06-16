import type { Assignee } from './WidgetAssignee.types';

export const convertClientToServer = (assignee?: Assignee): any | null => (
    assignee
        ? {
            uid: assignee.id,
            displayName: assignee.name,
            username: assignee.username,
            firstName: assignee.firstName,
            surname: assignee.surname,
        }
        : null
);
