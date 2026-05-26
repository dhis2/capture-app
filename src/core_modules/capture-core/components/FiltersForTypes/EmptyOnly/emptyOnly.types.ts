export type EmptyOnlyFilter = {
    value: string;
    isEmpty: boolean;
};

export type Value = string | null | undefined;

export type EmptyOnlyFilterProps = {
    value?: Value;
    onCommitValue: (value?: Value | null) => void;
};

export type EmptyOnlyFilterManagerProps = {
    filter: EmptyOnlyFilter | null | undefined;
    filterTypeRef: (instance: unknown) => void;
    handleCommitValue: () => void;
};
