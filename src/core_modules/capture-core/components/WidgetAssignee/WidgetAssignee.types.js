// @flow
import type { ProgramStage } from '../../metaData';
import type { UserFormField } from '../FormFields/UserField';

export type Assignee = {
    id: string,
    username: string,
    name: string,
    firstName: string,
    surname: string,
}

export type Props = {|
    assignee: UserFormField | null,
    programStage: ?ProgramStage,
    eventAccess: {|
        read: boolean,
        write: boolean,
    |} | null,
    onGetSaveContext: () => { event: ApiEnrollmentEvent },
    onSave: (newAssignee: UserFormField) => void,
    onSaveError: (prevAssignee: UserFormField | null) => void,
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
