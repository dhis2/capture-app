import type { UserFormField } from '../../FormFields/UserField/types';

export type Props = {
    classes: {
        container: string;
        label: string;
        field: string;
    };
    assignee?: UserFormField | null;
    onSet: (user: UserFormField) => void;
};
