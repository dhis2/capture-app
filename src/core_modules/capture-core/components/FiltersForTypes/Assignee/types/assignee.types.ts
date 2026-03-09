import type { assigneeFilterModes } from '../constants';

export type AssigneeFilterData = {
    assignedUserMode: typeof assigneeFilterModes[keyof typeof assigneeFilterModes] | string;
    assignedUser?: {
        id: string;
        username: string;
        name: string;
    } | null;
    isEmpty?: boolean;
    value?: string;
};
