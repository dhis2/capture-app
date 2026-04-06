import type { EmptyValueFilterData } from '../../EmptyValue/types';

export type TrueOnlyValueFilterData = {
    value: boolean;
};

export type TrueOnlyFilterData = TrueOnlyValueFilterData | EmptyValueFilterData;
