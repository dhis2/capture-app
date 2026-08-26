import { convertClientToServer } from '../../../../converters';
import { dataElementTypes } from '../../../../metaData';
import { dateUtils } from '../../../../rules/converters';

export const isWithinCompleteEventsExpiry = (
    completedAt?: string | null,
    completeEventsExpiryDays?: number | null,
): boolean => {
    if (!completeEventsExpiryDays || completeEventsExpiryDays <= 0) {
        return true;
    }

    if (!completedAt) {
        return true;
    }

    const completedAtServer = convertClientToServer(completedAt, dataElementTypes.DATE) as string;
    const today = dateUtils.getToday();
    const firstInvalidDate = dateUtils.addDays(completedAtServer, completeEventsExpiryDays);

    return dateUtils.compareDates(today, firstInvalidDate) < 0;
};
