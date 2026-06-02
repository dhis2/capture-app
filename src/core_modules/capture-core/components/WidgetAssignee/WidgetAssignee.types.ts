export type Assignee = {
    id: string;
    username: string;
    name: string;
    firstName: string;
    surname: string;
};

export type Props = {
    assignee: Assignee | null;
    enabled: boolean;
    readOnly: boolean;
    getSaveContext: () => { event: Record<string, unknown> };
    onSave: (newAssignee: Assignee) => void;
    onSaveError: (prevAssignee: Assignee | null) => void;
};

export type PlainProps = {
    assignee: Assignee | null;
    readOnly: boolean;
    onSet: (user: Assignee | null) => void;
    avatarId?: string;
};
