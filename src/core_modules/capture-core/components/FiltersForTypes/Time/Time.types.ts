export type Value = {
    from?: string | null;
    to?: string | null;
} | null;

export type TimeFilterProps = {
    onCommitValue: (value: Value) => void;
    value: Value;
};
