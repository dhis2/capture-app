import type { EmptyValueFilterData } from '../../EmptyValue/types';

export type UsernameValueFilterData = {
    value: string;
};

export type UsernameFilterData = UsernameValueFilterData | EmptyValueFilterData;
