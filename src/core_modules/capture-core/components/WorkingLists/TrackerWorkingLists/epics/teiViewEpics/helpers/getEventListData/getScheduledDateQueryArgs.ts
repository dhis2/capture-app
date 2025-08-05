import moment from 'moment';
import { getFormattedStringFromMomentUsingEuropeanGlyphs } from 'capture-core-utils/date';
import { statusTypes } from 'capture-core/events/statusTypes';

export const getScheduledDateQueryArgs = (queryArgs: any) =>
    ((queryArgs as any).status === statusTypes.SCHEDULE && !queryArgs.hasOwnProperty('scheduledAfter')
        ? { ...queryArgs, scheduledAfter: getFormattedStringFromMomentUsingEuropeanGlyphs(moment()) }
        : queryArgs);
