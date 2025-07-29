export type Value = string | null | undefined;

export type TextFilterProps = {
    onCommitValue: (value: Value) => void;
    onUpdate: (updatedValue: Value) => void;
    value: Value;
};

export type InputProps = {
    onChange: (value: string) => void;
    onBlur: (value: string) => void;
    onEnterKey: (value: Value) => void;
    value: Value;
};
