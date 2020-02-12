// @flow
import { type AssigneeFilterData } from '../../../eventList.types';

export function convertAssignee(
    sourceValue: AssigneeFilterData,
) {
    return {
        assignedUserMode: sourceValue.assignedUserMode,
        assignedUser: sourceValue.assignedUser && sourceValue.assignedUser.id,
    };
}
