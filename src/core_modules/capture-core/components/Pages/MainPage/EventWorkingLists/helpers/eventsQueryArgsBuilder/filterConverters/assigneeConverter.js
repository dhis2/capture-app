// @flow
import type { AssigneeFilterData } from '../../../../../../ListView';

export function convertAssignee(sourceValue: AssigneeFilterData) {
  return {
    assignedUserMode: sourceValue.assignedUserMode,
    assignedUser: sourceValue.assignedUser && sourceValue.assignedUser.id,
  };
}
