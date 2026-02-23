export type Value = string | null | undefined;

export type TextFilterProps = {
    onValueChange?: (value: Value) => void;
    onCommitValue: (value: Value) => void;
    onUpdate?: (updatedValue: Value) => void;
    value: Value;
    unique?: boolean;
    searchOperator?: string;
    minCharactersToSearch?: number;
};
