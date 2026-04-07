import type { EmptyValueFilterData } from '../EmptyValue/emptyValue.types';
import type { Options } from '../../FormFields/Options/SelectBoxes';

export type OptionSetValuesFilterData = {
    usingOptionSet: boolean;
    values: Array<any>;
};

export type OptionSetFilterData = OptionSetValuesFilterData | EmptyValueFilterData;

export type Value = Array<string> | string | null | undefined;

export type PlainProps = {
    options: Options;
    value: Value;
    onCommitValue: (value: Value) => void;
    singleSelect?: boolean;
    disableEmptyValueFilter?: boolean;
};
