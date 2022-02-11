// @flow
import moment from 'moment';
import { PERIODS, DATE_TYPES } from '../../../constants';
import type { ApiPeriodDate } from '../../../types';

type AbsoluteDateFilterData = {|
    type: 'ABSOLUTE',
    ge?: string,
    le?: string,
|};

type RelativeDateFilterData = {|
    type: 'RELATIVE',
    period: string,
|};

const getApiShape = (today, startDate, endDate) => ({
    periodFrom: startDate.diff(today, 'days'),
    periodTo: endDate.diff(today, 'days'),
});

const relativeConvertersForPeriods = (filter: RelativeDateFilterData) => {
    const { period } = filter;
    const today = moment();
    switch (period) {
    case PERIODS.TODAY:
        return getApiShape(today, moment(), moment());
    case PERIODS.THIS_WEEK:
        return getApiShape(today, moment().startOf('week'), moment().endOf('week'));
    case PERIODS.THIS_MONTH:
        return getApiShape(today, moment().startOf('month'), moment().endOf('month'));
    case PERIODS.THIS_YEAR:
        return getApiShape(today, moment().startOf('year'), moment().endOf('year'));
    case PERIODS.LAST_WEEK:
        return getApiShape(today, moment().subtract(1, 'weeks').startOf('week'), moment().subtract(1, 'weeks').endOf('week'));
    case PERIODS.LAST_MONTH:
        return getApiShape(today, moment().subtract(1, 'months').startOf('month'), moment().subtract(1, 'months').endOf('month'));
    case PERIODS.LAST_3_MONTHS:
        return getApiShape(today, moment().subtract(3, 'months').startOf('month'), moment().subtract(1, 'months').endOf('month'));
    }
    return null;
};

const absoluteConvertersForPeriods = (filter: AbsoluteDateFilterData) => getApiShape(moment(), moment(filter.ge), moment(filter.le));

export const convertValue = (filter: any): ApiPeriodDate | null =>
    (filter.type === DATE_TYPES.ABSOLUTE ? absoluteConvertersForPeriods(filter) : relativeConvertersForPeriods(filter));
