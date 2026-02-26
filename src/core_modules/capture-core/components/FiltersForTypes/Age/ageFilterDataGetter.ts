import { convertLocalToIsoCalendar } from '../../../utils/converters/date';
import type { AgeFilterData } from './Age.types';

export const getAgeFilterData = (value: string | null | undefined): AgeFilterData | null => {
    if (!value?.trim()) {
        return null;
    }
    try {
        const isoDate = convertLocalToIsoCalendar(value.trim());
        return {
            type: 'ABSOLUTE',
            ge: isoDate,
            le: isoDate,
        };
    } catch {
        return null;
    }
};
