import type { UserFormField } from '../../FormFields/UserField';

export type PlainProps = {
    assignee?: UserFormField;
    onSetAssignee: (user: UserFormField) => void;
};
