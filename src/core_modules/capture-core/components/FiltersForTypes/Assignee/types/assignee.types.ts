import type { assigneeFilterModes } from '../constants';

export type AssigneeFilterData = {
    assignedUserMode: typeof assigneeFilterModes[keyof typeof assigneeFilterModes];
    assignedUser?: {
        id: string;
        username: string;
        name: string;
    } | null;
};
export type Value = {
    mode: string;
    provided?: any;
} | null;

export type PlainProps = {
    value?: Value;
    onCommitValue: (value: any) => void;
};
