import type { AssigneeFilterData } from '../../../../../ListView';

export function convertAssignee(
    { sourceValue }: { sourceValue: AssigneeFilterData },
) {
    return {
        assignedUserMode: sourceValue.assignedUserMode,
        assignedUsers: sourceValue.assignedUser?.id,
    };
}
