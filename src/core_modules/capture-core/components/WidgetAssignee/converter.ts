import type { Assignee } from './WidgetAssignee.types';

type ServerAssignee = {
    uid: string;
    displayName: string;
    username: string;
    firstName: string;
    surname: string;
};

export const convertClientToServer = (assignee?: Assignee): ServerAssignee | null => (
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
