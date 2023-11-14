// @flow
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
    enabled: boolean,
    writeAccess: boolean,
    onGetSaveContext: () => { event: ApiEnrollmentEvent },
    onSave: (newAssignee: UserFormField) => void,
    onSaveError: (prevAssignee: UserFormField | null) => void,
|};

export type PlainProps = {|
    assignee: UserFormField | null,
    writeAccess: boolean,
    onSet: (user: UserFormField) => void,
    ...CssClasses,
|};
