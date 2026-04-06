import type { EmptyValueFilterData } from '../../EmptyValue/types';

export type TextValueFilterData = {
    value: string,
};

export type TextFilterData = TextValueFilterData | EmptyValueFilterData;
