export type Value = string | null | undefined;

export type TextFilterProps = {
    onCommitValue: (value: Value) => void;
    onUpdate: (updatedValue: Value) => void;
    value: Value;
};

