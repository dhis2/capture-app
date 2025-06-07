// @flow
import moment from 'moment';
import { getFormattedStringFromMomentUsingEuropeanGlyphs } from 'capture-core-utils/date';
import { statusTypes } from 'capture-core/events/statusTypes';

export const getScheduledDateQueryArgs = (queryArgs: Object) =>
    (queryArgs.status === statusTypes.SCHEDULE && !queryArgs.hasOwnProperty('scheduledAfter')
        ? { ...queryArgs, scheduledAfter: getFormattedStringFromMomentUsingEuropeanGlyphs(moment()) }
        : queryArgs);
