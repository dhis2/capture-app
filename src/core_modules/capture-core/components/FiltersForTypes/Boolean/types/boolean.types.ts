import type { EmptyValueFilterData } from '../../EmptyValue/types';

export type BooleanFilterData = {
    values: Array<boolean>,
};

export type BooleanValuesStringified = {
    values: Array<string>;
};

export type BooleanFilterStringified = BooleanValuesStringified | EmptyValueFilterData;
