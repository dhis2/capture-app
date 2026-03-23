export type Value = {
    from?: string | null;
    to?: string | null;
} | string | null;

export type TimeFilterProps = {
    onCommitValue: (value: Value) => void;
    value: Value;
};
