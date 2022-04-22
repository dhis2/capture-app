// @flow
import { createSelector } from 'reselect';
import moment from 'moment';
import { getFormattedStringFromMomentUsingEuropeanGlyphs } from 'capture-core-utils/date';

import type {
    DateFilterData,
    RelativeDateFilterData,
    AbsoluteDateFilterData,
} from '../../../../../ListView';
import { areRelativeRangeValuesSupported } from '../../../../../../utils/validators/areRelativeRangeValuesSupported';

const periods = {
    TODAY: 'TODAY',
    THIS_WEEK: 'THIS_WEEK',
    THIS_MONTH: 'THIS_MONTH',
    THIS_YEAR: 'THIS_YEAR',
    LAST_WEEK: 'LAST_WEEK',
    LAST_MONTH: 'LAST_MONTH',
    LAST_3_MONTHS: 'LAST_3_MONTHS',
    RELATIVE_RANGE: 'RELATIVE_RANGE',
    ABSOLUTE_RANGE: 'ABSOLUTE_RANGE',
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

function getSelector(key: string, storeId: string, isInit: boolean) {
    if (!selectors[storeId] || isInit) {
        selectors[storeId] = {};
    }

    const listSelectors = selectors[storeId];
    if (!listSelectors[key]) {
        listSelectors[key] = createSelector(
            sourceValue => sourceValue,
            sourceValue =>
                relativeConvertersForPeriods[sourceValue.period] && relativeConvertersForPeriods[sourceValue.period](),
        );
    }

    const selector = listSelectors[key];

    return selector;
}

function convertCustomRelativeDate(sourceValue: RelativeDateFilterData) {
    const { startBuffer, endBuffer } = sourceValue;
    const requestData = [];

    if (startBuffer || startBuffer === 0) {
        const startDate = moment().add(startBuffer, 'days');
        const startBufferFilterRequest = getFormattedStringFromMomentUsingEuropeanGlyphs(startDate);
        requestData.push(`ge:${startBufferFilterRequest}`);
    }

    if (endBuffer || endBuffer === 0) {
        const endDate = moment().add(endBuffer, 'days');
        const endBufferFilterRequest = getFormattedStringFromMomentUsingEuropeanGlyphs(endDate);
        requestData.push(`le:${endBufferFilterRequest}`);
    }
    return requestData;
}

function convertRelativeDate(
    sourceValue: RelativeDateFilterData,
    key: string,
    storeId: string,
    isInit: boolean,
) {
    let requestData = [];
    if (areRelativeRangeValuesSupported(sourceValue.startBuffer, sourceValue.endBuffer)) {
        requestData = convertCustomRelativeDate(sourceValue);
        return requestData?.join(':');
    }
    if (sourceValue.period) {
        requestData = getSelector(key, storeId, isInit)(sourceValue);
        return requestData?.join(':');
    }
    return '';
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
    return requestData?.join(':');
}

export function convertDate(
    sourceValue: DateFilterData,
    key: string,
    storeId: string,
    isInit: boolean,
) {
    if (sourceValue.type === 'ABSOLUTE') {
        return convertAbsoluteDate(sourceValue);
    }

    return convertRelativeDate(sourceValue, key, storeId, isInit);
}

export function clearMemoization(storeId: string) {
    selectors[storeId] = {};
}
