export type Value = string | null | undefined;

export type TextFilterProps = {
    onCommitValue: (value: Value, isBlur?: boolean) => void;
    onUpdate: (commitValue?: any) => void;
    value: Value;
    searchOperator?: string;
};
