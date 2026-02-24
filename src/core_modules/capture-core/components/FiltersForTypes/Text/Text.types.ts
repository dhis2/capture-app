export type Value = string | null | undefined;

export type TextFilterProps = {
    onCommitValue: (value: Value, isCommit?: boolean) => void;
    onUpdate: (commitValue?: any) => void;
    value: Value;
};
