// @flow
import type { UserFormField } from '../FormFields/UserField';

export const convertClientToServer = (assignee: UserFormField): ApiAssignedUser => ({
    uid: assignee.id,
    displayName: assignee.name,
    username: assignee.username,
});

export const convertServerToClient = (assignedUser?: ApiAssignedUser): UserFormField | null => {
    if (!assignedUser) {
        return null;
    }
    return {
        id: assignedUser.uid,
        name: assignedUser.displayName,
        username: assignedUser.username,
    };
};
