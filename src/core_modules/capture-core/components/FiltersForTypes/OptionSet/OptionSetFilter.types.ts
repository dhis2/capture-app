import type { Options } from '../../FormFields/Options/SelectBoxes';

export type Value = Array<string> | string | null | undefined;

export type PlainProps = {
    options: Options;
    value: Value;
    onCommitValue: (value: Value) => void;
    singleSelect?: boolean;
    disableEmptyValueFilter?: boolean;
};
