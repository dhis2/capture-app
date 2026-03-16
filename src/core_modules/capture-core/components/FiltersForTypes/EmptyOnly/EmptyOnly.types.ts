export type Value = string | null | undefined;

export type PlainProps = {
    value?: Value;
    onCommitValue: (value?: Value | null) => void;
};
