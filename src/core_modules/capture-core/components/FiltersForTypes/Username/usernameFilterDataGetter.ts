import type { UsernameFilterData } from './types';
import type { Value } from './Username.types';

export const getUsernameFilterData = (value: Value): UsernameFilterData | null | undefined => {
    if (!value) return null;
    return { value };
};
