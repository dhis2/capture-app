// @flow
import { createSelector } from 'reselect';
import { moment } from 'capture-core-utils/moment';
import { getFormattedStringFromMomentUsingEuropeanGlyphs } from 'capture-core-utils/date';

import type {
    DateFilterData,
    RelativeDateFilterData,
    AbsoluteDateFilterData,
} from '../../../../EventsList/eventList.types';

const periods = {
    TODAY: 'TODAY',
    THIS_WEEK: 'THIS_WEEK',
    THIS_MONTH: 'THIS_MONTH',
    THIS_YEAR: 'THIS_YEAR',
    LAST_WEEK: 'LAST_WEEK',
    LAST_MONTH: 'LAST_MONTH',
    LAST_3_MONTHS: 'LAST_3_MONTHS',
    CUSTOM_RANGE: 'CUSTOM_RANGE',
};

const selectors = {};
const relativeConvertersForPeriods = {
    [periods.TODAY]: () => {
        const startDate = moment();
        const endDate = startDate;

        return [
            `ge:${getFormattedStringFromMomentUsingEuropeanGlyphs(startDate)}`,
            `le:${getFormattedStringFromMomentUsingEuropeanGlyphs(endDate)}`,
        ];
    },
    [periods.THIS_WEEK]: () => {
        const startDate = moment().startOf('week');
        const endDate = moment().endOf('week');

        return [
            `ge:${getFormattedStringFromMomentUsingEuropeanGlyphs(startDate)}`,
            `le:${getFormattedStringFromMomentUsingEuropeanGlyphs(endDate)}`,
        ];
    },
    [periods.THIS_MONTH]: () => {
        const startDate = moment().startOf('month');
        const endDate = moment().endOf('month');

        return [
            `ge:${getFormattedStringFromMomentUsingEuropeanGlyphs(startDate)}`,
            `le:${getFormattedStringFromMomentUsingEuropeanGlyphs(endDate)}`,
        ];
    },
    [periods.THIS_YEAR]: () => {
        const startDate = moment().startOf('year');
        const endDate = moment().endOf('year');

        return [
            `ge:${getFormattedStringFromMomentUsingEuropeanGlyphs(startDate)}`,
            `le:${getFormattedStringFromMomentUsingEuropeanGlyphs(endDate)}`,
        ];
    },
    [periods.LAST_WEEK]: () => {
        const startDate = moment().subtract(1, 'weeks').startOf('week');
        const endDate = moment().subtract(1, 'weeks').endOf('week');

        return [
            `ge:${getFormattedStringFromMomentUsingEuropeanGlyphs(startDate)}`,
            `le:${getFormattedStringFromMomentUsingEuropeanGlyphs(endDate)}`,
        ];
    },
    [periods.LAST_MONTH]: () => {
        const startDate = moment().subtract(1, 'months').startOf('month');
        const endDate = moment().subtract(1, 'months').endOf('month');

        return [
            `ge:${getFormattedStringFromMomentUsingEuropeanGlyphs(startDate)}`,
            `le:${getFormattedStringFromMomentUsingEuropeanGlyphs(endDate)}`,
        ];
    },
    [periods.LAST_3_MONTHS]: () => {
        const startDate = moment().subtract(3, 'months').startOf('month');
        const endDate = moment().subtract(1, 'months').endOf('month');

        return [
            `ge:${getFormattedStringFromMomentUsingEuropeanGlyphs(startDate)}`,
            `le:${getFormattedStringFromMomentUsingEuropeanGlyphs(endDate)}`,
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
        const fromFilterRequest = getFormattedStringFromMomentUsingEuropeanGlyphs(moment(sourceValue.ge));
        requestData.push(`ge:${fromFilterRequest}`);
    }

    if (sourceValue.le) {
        const toFilterRequest = getFormattedStringFromMomentUsingEuropeanGlyphs(moment(sourceValue.le));
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
