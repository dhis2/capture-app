export type EmptyOnlyFilterData = {
    value: string;
    isEmpty: boolean;
};

export type Value = string | null | undefined;

export type EmptyOnlyFilterProps = {
    value?: Value;
    onCommitValue: (value?: Value | null) => void;
};

export type EmptyOnlyFilterManagerProps = {
    filter: EmptyOnlyFilterData | null | undefined;
    filterTypeRef: (instance: unknown) => void;
    handleCommitValue: () => void;
};
