// @flow
import { featureAvailable, FEATURES } from 'capture-core-utils';
import type { AssigneeFilterData } from '../../../../../ListView';

export function convertAssignee(
    { sourceValue }: { sourceValue: AssigneeFilterData },
) {
    const assignedUsersQueryParam: string = featureAvailable(FEATURES.newEntityFilterQueryParam)
        ? 'assignedUsers'
        : 'assignedUser';
    return {
        assignedUserMode: sourceValue.assignedUserMode,
        [assignedUsersQueryParam]: sourceValue.assignedUser?.id,
    };
}
