import type { AssigneeFilterData, AssigneeMode } from './assignee.types';

export function getAssigneeFilterData(value: {
    mode: AssigneeMode;
    provided?: AssigneeFilterData['assignedUser'];
}): AssigneeFilterData {
    return {
        assignedUserMode: value.mode,
        assignedUser: value.provided,
    };
}
