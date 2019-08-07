// @flow
import i18n from '@dhis2/d2-i18n';
import moment from '../../../utils/moment/momentResolver';
import { mainOptionKeys, mainOptionTranslatedTexts } from './mainOptions';
import { dataElementTypes as elementTypes } from '../../../metaData';
import { convertValue as convertToClientValue } from '../../../converters/formToClient';
import { convertValue as convertToFormValue } from '../../../converters/clientToForm';


type Value = {
    main: string,
    from?: ?string,
    to?: ?string,
}

const formatDateForFilterRequest = (dateMoment: moment$Moment) => dateMoment.format('YYYY-MM-DD');

const convertDateFilterValueToClientValue = (formValue: string): string =>
    // $FlowFixMe
    convertToClientValue(formValue, elementTypes.DATE);

const convertDateFilterValueToFormValue = (clientValue: string): string =>
    // $FlowFixMe
    convertToFormValue(clientValue, elementTypes.DATE);


const mapMainSelectionsToAppliedText = {
    [mainOptionKeys.TODAY]: () =>
        mainOptionTranslatedTexts[mainOptionKeys.TODAY],
    [mainOptionKeys.THIS_WEEK]: () =>
        mainOptionTranslatedTexts[mainOptionKeys.THIS_WEEK],
    [mainOptionKeys.THIS_MONTH]: () =>
        mainOptionTranslatedTexts[mainOptionKeys.THIS_MONTH],
    [mainOptionKeys.THIS_YEAR]: () =>
        mainOptionTranslatedTexts[mainOptionKeys.THIS_YEAR],
    [mainOptionKeys.LAST_WEEK]: () =>
        mainOptionTranslatedTexts[mainOptionKeys.LAST_WEEK],
    [mainOptionKeys.LAST_MONTH]: () =>
        mainOptionTranslatedTexts[mainOptionKeys.LAST_MONTH],
    [mainOptionKeys.LAST_3_MONTHS]: () =>
        mainOptionTranslatedTexts[mainOptionKeys.LAST_3_MONTHS],
    [mainOptionKeys.CUSTOM_RANGE]: (fromValue: ?string, toValue: ?string) => {
        let appliedText = '';
        if (fromValue && toValue) {
            const valueFromClient = convertDateFilterValueToClientValue(fromValue);
            const valueToClient = convertDateFilterValueToClientValue(toValue);
            const momentFrom = moment(valueFromClient);
            const momentTo = moment(valueToClient);
            if (momentFrom.isSame(momentTo)) {
                appliedText = convertDateFilterValueToFormValue(valueFromClient);
            } else {
                const appliedTextFrom = convertDateFilterValueToFormValue(valueFromClient);
                const appliedTextTo = convertDateFilterValueToFormValue(valueToClient);
                appliedText = `${appliedTextFrom} ${i18n.t('to')} ${appliedTextTo}`;
            }
        } else if (fromValue) {
            const valueFromClient = convertDateFilterValueToClientValue(fromValue);
            const appliedTextFrom = convertDateFilterValueToFormValue(valueFromClient);
            appliedText = `${i18n.t('after or equal to')} ${appliedTextFrom}`;
        } else {
            // $FlowSuppress
            const valueToClient = convertDateFilterValueToClientValue(toValue);
            const appliedTextTo = convertDateFilterValueToFormValue(valueToClient);
            appliedText = `${i18n.t('before or equal to')} ${appliedTextTo}`;
        }
        return appliedText;
    },
};

const mapMainSelectionsToRequests = {
    [mainOptionKeys.TODAY]: () => {
        const startDate = moment();
        const endDate = startDate;

        return [
            `ge:${formatDateForFilterRequest(startDate)}`,
            `le:${formatDateForFilterRequest(endDate)}`,
        ];
    },
    [mainOptionKeys.THIS_WEEK]: () => {
        const startDate = moment().startOf('week');
        const endDate = moment().endOf('week');

        return [
            `ge:${formatDateForFilterRequest(startDate)}`,
            `le:${formatDateForFilterRequest(endDate)}`,
        ];
    },
    [mainOptionKeys.THIS_MONTH]: () => {
        const startDate = moment().startOf('month');
        const endDate = moment().endOf('month');

        return [
            `ge:${formatDateForFilterRequest(startDate)}`,
            `le:${formatDateForFilterRequest(endDate)}`,
        ];
    },
    [mainOptionKeys.THIS_YEAR]: () => {
        const startDate = moment().startOf('year');
        const endDate = moment().endOf('year');

        return [
            `ge:${formatDateForFilterRequest(startDate)}`,
            `le:${formatDateForFilterRequest(endDate)}`,
        ];
    },
    [mainOptionKeys.LAST_WEEK]: () => {
        const startDate = moment().subtract(1, 'weeks').startOf('week');
        const endDate = moment().subtract(1, 'weeks').endOf('week');

        return [
            `ge:${formatDateForFilterRequest(startDate)}`,
            `le:${formatDateForFilterRequest(endDate)}`,
        ];
    },
    [mainOptionKeys.LAST_MONTH]: () => {
        const startDate = moment().subtract(1, 'months').startOf('month');
        const endDate = moment().subtract(1, 'months').endOf('month');

        return [
            `ge:${formatDateForFilterRequest(startDate)}`,
            `le:${formatDateForFilterRequest(endDate)}`,
        ];
    },
    [mainOptionKeys.LAST_3_MONTHS]: () => {
        const startDate = moment().subtract(3, 'months').startOf('month');
        const endDate = moment().subtract(1, 'months').endOf('month');

        return [
            `ge:${formatDateForFilterRequest(startDate)}`,
            `le:${formatDateForFilterRequest(endDate)}`,
        ];
    },
    [mainOptionKeys.CUSTOM_RANGE]: (fromValue: ?string, toValue: ?string) => {
        const requestData = [];
        if (fromValue) {
            const fromClientValue: string = convertDateFilterValueToClientValue(fromValue);
            const fromFilterRequest = formatDateForFilterRequest(moment(fromClientValue));
            requestData.push(`ge:${fromFilterRequest}`);
        }
        if (toValue) {
            const toClientValue: string = convertDateFilterValueToClientValue(toValue);
            const toFilterRequest = formatDateForFilterRequest(moment(toClientValue));
            requestData.push(`le:${toFilterRequest}`);
        }
        return requestData;
    },
};


export const getRequestData = (value: Value) =>
    mapMainSelectionsToRequests[value.main](value.from, value.to);

export const getAppliedText = (value: Value) =>
    mapMainSelectionsToAppliedText[value.main](value.from, value.to);

export default function (value: Value) {
    return {
        requestData: getRequestData(value),
        appliedText: getAppliedText(value),
    };
}
