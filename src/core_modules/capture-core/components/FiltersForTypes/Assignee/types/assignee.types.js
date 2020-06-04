// @flow
import { assigneeFilterModes } from '../constants';

export type AssigneeFilterData = {
    assignedUserMode: $Values<typeof assigneeFilterModes>,
    assignedUser?: ?{
        id: string,
        username: string,
        name: string,
    },
};
