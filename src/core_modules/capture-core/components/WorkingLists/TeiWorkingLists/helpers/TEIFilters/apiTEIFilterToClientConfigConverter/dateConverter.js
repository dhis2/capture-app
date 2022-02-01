// @flow
import moment from 'moment';
import { type DateFilterData } from '../../../../WorkingListsBase';
import { PERIODS } from '../../../constants';
import { apiDateFilterTypes } from '../../../../EventWorkingLists/constants';

const getRelativePeriod = (periodFrom, periodTo) => {
    const today = moment();
    if (periodFrom === moment().diff(today, 'days') && periodTo === moment().diff(today, 'days')) {
        return PERIODS.TODAY;
    }
    if (periodFrom === moment().startOf('week').diff(today, 'days') && periodTo === moment().endOf('week').diff(today, 'days')) {
        return PERIODS.THIS_WEEK;
    }
    if (periodFrom === moment().startOf('month').diff(today, 'days') && periodTo === moment().endOf('month').diff(today, 'days')) {
        return PERIODS.THIS_MONTH;
    }
    if (periodFrom === moment().startOf('year').diff(today, 'days') && periodTo === moment().endOf('year').diff(today, 'days')) {
        return PERIODS.THIS_YEAR;
    }
    if (
        periodFrom === moment().subtract(1, 'weeks').startOf('week').diff(today, 'days') &&
        periodTo === moment().subtract(1, 'weeks').endOf('week').diff(today, 'days')
    ) {
        return PERIODS.LAST_WEEK;
    }
    if (
        periodFrom === moment().subtract(1, 'months').startOf('month').diff(today, 'days') &&
        periodTo === moment().subtract(1, 'months').endOf('month').diff(today, 'days')
    ) {
        return PERIODS.LAST_MONTH;
    }
    if (
        periodFrom === moment().subtract(3, 'months').startOf('month').diff(today, 'days') &&
        periodTo === moment().subtract(1, 'months').endOf('month').diff(today, 'days')
    ) {
        return PERIODS.LAST_3_MONTHS;
    }
    return null;
};

export const convertValue = (dateFilter: {periodFrom: number, periodTo: number}): DateFilterData => {
    const { periodFrom, periodTo } = dateFilter;
    const period = getRelativePeriod(periodFrom, periodTo);

    if (period) {
        return {
            period,
            type: apiDateFilterTypes.RELATIVE,
        };
    }

    return {
        ge: moment().add(periodFrom, 'days').format('YYYY-MM-DD'),
        le: moment().add(periodTo, 'days').format('YYYY-MM-DD'),
        type: apiDateFilterTypes.ABSOLUTE,
    };
};
