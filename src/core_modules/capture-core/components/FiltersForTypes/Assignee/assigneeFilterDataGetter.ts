import type { AssigneeFilterData } from './types';

export function getAssigneeFilterData(value: any): AssigneeFilterData {
    return {
        assignedUserMode: value.mode,
        assignedUser: value.provided,
    };
}
