// @flow

export type Assignee = {
    id: string,
    username: string,
    name: string,
    firstName: string,
    surname: string,
}

export type Props = {|
    assignee: Assignee | null,
    enabled: boolean,
    writeAccess: boolean,
    getSaveContext: () => { event: ApiEnrollmentEvent },
    onSave: (newAssignee: Assignee) => void,
    onSaveError: (prevAssignee: Assignee | null) => void,
|};

export type PlainProps = {|
    assignee: Assignee | null,
    writeAccess: boolean,
    onSet: (user: Assignee | null) => void,
    avatarId?: string,
    ...CssClasses,
|};
