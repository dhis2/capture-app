import { formatMomentEn } from 'capture-core-utils/date';
import { statusTypes } from 'capture-core/events/statusTypes';

export const getScheduledDateQueryArgs = (queryArgs: any) =>
    (queryArgs.status === statusTypes.SCHEDULE && !queryArgs.hasOwnProperty('scheduledAfter')
        ? { ...queryArgs, scheduledAfter: formatMomentEn(new Date()) }
        : queryArgs);
