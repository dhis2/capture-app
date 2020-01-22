// @flow
import { createSelector } from 'reselect';
import { moment } from 'capture-core-utils/moment';

const periods = {
    TODAY: 'TODAY',
    THIS_WEEK: 'THIS_WEEK',
    THIS_MONTH: 'THIS_MONTH',
    THIS_YEAR: 'THIS_YEAR',
    LAST_WEEK: 'LAST_WEEK',
    LAST_MONTH: 'LAST_MONTH',
    LAST_3_MONTHS: 'LAST_THREE_MONTHS',
    CUSTOM_RANGE: 'CUSTOM_RANGE',
};

const selectors = {};
const formatDateForFilterRequest = (dateMoment: moment$Moment) => dateMoment.format('YYYY-MM-DD');
const relativeConvertersForPeriods = {
    [periods.TODAY]: () => {
        const startDate = moment();
        const endDate = startDate;

        return [
            `ge:${formatDateForFilterRequest(startDate)}`,
            `le:${formatDateForFilterRequest(endDate)}`,
        ];
    },
    [periods.THIS_WEEK]: () => {
        const startDate = moment().startOf('week');
        const endDate = moment().endOf('week');

        return [
            `ge:${formatDateForFilterRequest(startDate)}`,
            `le:${formatDateForFilterRequest(endDate)}`,
        ];
    },
    [periods.THIS_MONTH]: () => {
        const startDate = moment().startOf('month');
        const endDate = moment().endOf('month');

        return [
            `ge:${formatDateForFilterRequest(startDate)}`,
            `le:${formatDateForFilterRequest(endDate)}`,
        ];
    },
    [periods.THIS_YEAR]: () => {
        const startDate = moment().startOf('year');
        const endDate = moment().endOf('year');

        return [
            `ge:${formatDateForFilterRequest(startDate)}`,
            `le:${formatDateForFilterRequest(endDate)}`,
        ];
    },
    [periods.LAST_WEEK]: () => {
        const startDate = moment().subtract(1, 'weeks').startOf('week');
        const endDate = moment().subtract(1, 'weeks').endOf('week');

        return [
            `ge:${formatDateForFilterRequest(startDate)}`,
            `le:${formatDateForFilterRequest(endDate)}`,
        ];
    },
    [periods.LAST_MONTH]: () => {
        const startDate = moment().subtract(1, 'months').startOf('month');
        const endDate = moment().subtract(1, 'months').endOf('month');

        return [
            `ge:${formatDateForFilterRequest(startDate)}`,
            `le:${formatDateForFilterRequest(endDate)}`,
        ];
    },
    [periods.LAST_3_MONTHS]: () => {
        const startDate = moment().subtract(3, 'months').startOf('month');
        const endDate = moment().subtract(1, 'months').endOf('month');

        return [
            `ge:${formatDateForFilterRequest(startDate)}`,
            `le:${formatDateForFilterRequest(endDate)}`,
        ];
    },
};

function getSelector(key: string, listId: string, isInit: boolean) {
    if (!selectors[listId] || isInit) {
        selectors[listId] = {};
    }

    const listSelectors = selectors[listId];

    if (!listSelectors[key]) {
        listSelectors[key] = createSelector(
            sourceValue => sourceValue,
            sourceValue => relativeConvertersForPeriods[sourceValue.period](),
        );
    }

    const selector = listSelectors[key];

    return selector;
}

function convertRelativeDate(
    sourceValue: RelativeDateFilterData,
    key: string,
    listId: string,
    isInit: boolean,
) {
    return getSelector(key, listId, isInit)(sourceValue);
}

function convertAbsoluteDate(sourceValue: AbsoluteDateFilterData) {
    const requestData = [];
    if (sourceValue.ge) {
        const fromFilterRequest = formatDateForFilterRequest(moment(sourceValue.ge));
        requestData.push(`ge:${fromFilterRequest}`);
    }

    if (sourceValue.le) {
        const toFilterRequest = formatDateForFilterRequest(moment(sourceValue.le));
        requestData.push(`le:${toFilterRequest}`);
    }
    return requestData;
}

export function convertDate(
    sourceValue: DateFilterData,
    key: string,
    listId: string,
    isInit: boolean,
) {
    if (sourceValue.type === 'ABSOLUTE') {
        return convertAbsoluteDate(sourceValue);
    }

    return convertRelativeDate(sourceValue, key, listId, isInit);
}

export function clearMemoization(listId: string) {
    selectors[listId] = {};
}
