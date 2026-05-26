import type { EmptyValueFilterData } from '../EmptyValue/emptyValue.types';
import type { Options } from '../../FormFields/Options/SelectBoxes';

export type OptionSetFilterData = {
    usingOptionSet: boolean;
    values: Array<any>;
};

export type OptionSetFilter = OptionSetFilterData | EmptyValueFilterData;

export type Value = Array<string> | string | null | undefined;

export type OptionSetFilterProps = {
    options: Options;
    value: Value;
    onCommitValue: (value: Value) => void;
    singleSelect?: boolean;
    disableEmptyValueFilter?: boolean;
};

export type OptionSetFilterManagerProps = {
    filter: OptionSetFilter | null;
    filterTypeRef: (instance: unknown) => void;
    handleCommitValue: () => void;
    singleSelect: boolean;
};
