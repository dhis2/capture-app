import type { assigneeFilterModes } from './assignee.const';

export type AssigneeFilterData = {
    assignedUserMode: typeof assigneeFilterModes[keyof typeof assigneeFilterModes];
    assignedUser?: {
        id: string;
        username: string;
        name: string;
    } | null;
};

export type AssigneeMode = typeof assigneeFilterModes[keyof typeof assigneeFilterModes];

export type Value =
    | {
          mode: AssigneeMode;
          provided?: AssigneeFilterData['assignedUser'];
      }
    | null
    | undefined;

export type AssigneeFilterProps = {
    value?: Value;
    onCommitValue: (value: Value) => void;
};

export type AssigneeFilterManagerProps = {
    filter: AssigneeFilterData | null;
    filterTypeRef: (instance: unknown) => void;
    handleCommitValue: () => void;
};
