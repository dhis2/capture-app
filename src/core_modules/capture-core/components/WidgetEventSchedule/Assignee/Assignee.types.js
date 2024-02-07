// @flow
import type { UserFormField } from '../../FormFields/UserField';

export type Props = {
    ...CssClasses,
    assignee?: UserFormField,
    onSetAssignee: (user: UserFormField) => void,
};
