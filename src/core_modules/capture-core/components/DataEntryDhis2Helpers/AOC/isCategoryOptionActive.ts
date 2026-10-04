import { dateUtils } from '../../../rules/converters';

export const isCategoryOptionActive = (
    referenceDate: string | null | undefined,
    option: { startDate?: string | null; endDate?: string | null },
): boolean => {
    if (!referenceDate) return true;
    if (option.startDate && dateUtils.compareDates(referenceDate, option.startDate) < 0) return false;
    if (option.endDate && dateUtils.compareDates(referenceDate, option.endDate) > 0) return false;
    return true;
};
