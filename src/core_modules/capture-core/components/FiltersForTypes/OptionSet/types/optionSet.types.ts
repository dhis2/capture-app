import type { EmptyValueFilterData } from '../../EmptyValue/types';

export type OptionSetValuesFilterData = {
    usingOptionSet: boolean;
    values: Array<any>;
};

export type OptionSetFilterData = OptionSetValuesFilterData | EmptyValueFilterData;
