import type { UserFormField } from '../../FormFields/UserField';

export type PlainProps = {
    assignee?: UserFormField | null;
    onSetAssignee: (user: UserFormField) => void;
};
