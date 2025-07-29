export type Value = Array<any> | null | undefined;

export type PlainProps = {
    value: Value;
    onCommitValue: (value: Value) => void;
};

