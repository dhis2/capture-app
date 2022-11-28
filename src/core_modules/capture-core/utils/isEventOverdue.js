// @flow
import moment from 'moment';
import { statusTypes } from 'capture-core/events/statusTypes';

export const isEventOverdue = (event: {
    scheduledAt: string,
    status: 'ACTIVE' | 'VISITED' | 'COMPLETED' | 'SCHEDULE' | 'OVERDUE' | 'SKIPPED',
}) => moment(event.scheduledAt).isBefore(moment().startOf('day')) && event.status === statusTypes.SCHEDULE;
