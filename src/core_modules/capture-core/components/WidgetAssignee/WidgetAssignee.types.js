// @flow
import type { ProgramStage } from '../../metaData';
import type { UserFormField } from '../FormFields/UserField';

export type Props = {|
    assignee: UserFormField | null,
    programStage: ?ProgramStage,
    eventAccess: {|
        read: boolean,
        write: boolean,
    |} | null,
    onGetSaveContext: (assignee: UserFormField) => {
        eventId: string,
        events: Array<ApiEnrollmentEvent>,
        assignedUser?: ApiAssignedUser,
    },
|};

export type PlainProps = {|
    assignee: UserFormField | null,
    eventAccess: {|
        read: boolean,
        write: boolean,
    |} | null,
    onSet: (user: UserFormField) => void,
    ...CssClasses,
|};
