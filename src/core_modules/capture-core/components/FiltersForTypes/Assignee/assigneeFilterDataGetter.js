// @flow
import type { AssigneeFilterData } from '../filters.types';

export function getAssigneeFilterData(value: Object): AssigneeFilterData {
  return {
    assignedUserMode: value.mode,
    assignedUser: value.provided,
  };
}
