// @flow
import { typeof assigneeFilterModes } from '../constants';

export type AssigneeFilterData = {|
    assignedUserMode: $Values<assigneeFilterModes>,
    assignedUser?: ?{|
        id: string,
        username: string,
        name: string,
    |},
|};
