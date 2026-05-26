import type { AssigneeFilterData, Value } from './assignee.types';

export function getAssigneeFilterData(value: Value): AssigneeFilterData | null {
    if (!value) return null;
    return {
        assignedUserMode: value.mode,
        assignedUser: value.provided,
    };
}
