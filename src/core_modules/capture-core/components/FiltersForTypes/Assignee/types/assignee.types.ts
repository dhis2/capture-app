import type { assigneeFilterModes } from '../constants';

type AssigneeFilterModeData = {
    assignedUserMode: typeof assigneeFilterModes[keyof typeof assigneeFilterModes];
    assignedUser?: {
        id: string;
        username: string;
        name: string;
    } | null;
};

type EmptyValueAssigneeFilterData = {
    assignedUserMode: string;
    isEmpty: boolean;
    value: string;
};

export type AssigneeFilterData = AssigneeFilterModeData | EmptyValueAssigneeFilterData;
