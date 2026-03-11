import { featureAvailable, FEATURES } from 'capture-core-utils';
import type { AssigneeFilterData } from '../../../../../ListView';

export function convertAssignee(
    { sourceValue }: { sourceValue: AssigneeFilterData },
) {
    if ('isEmpty' in sourceValue) {
        return {
            assignedUserMode: sourceValue.assignedUserMode,
        };
    }
    const assignedUsersQueryParam: string = featureAvailable(FEATURES.newEntityFilterQueryParam)
        ? 'assignedUsers'
        : 'assignedUser';
    return {
        assignedUserMode: sourceValue.assignedUserMode,
        [assignedUsersQueryParam]: sourceValue.assignedUser?.id,
    };
}
