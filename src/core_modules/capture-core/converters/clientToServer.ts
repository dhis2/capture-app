import moment from 'moment';
import { dataElementTypes } from '../metaData';
import { stringifyNumber } from './common/stringifyNumber';
import { FEATURES, featureAvailable } from '../../capture-core-utils';
import type { ApiAssignedUser } from '../../capture-core-utils/types/api-types';

type RangeValue = {
    from: number;
    to: number;
};

type Assignee = {
    id: string;
    username: string;
    name: string;
    firstName: string;
    surname: string;
};

function convertDate(rawValue: string): string {
    const editedDate = rawValue;
    const momentDate = moment(editedDate);
    momentDate.locale('en');
    return momentDate.format('YYYY-MM-DD');
}

function convertRange(parser: (value: any) => any, rangeValue: RangeValue) {
    return {
        from: parser(rangeValue.from),
        to: parser(rangeValue.to),
    };
}

const convertAssigneeToServer = (assignee?: Assignee | null): ApiAssignedUser | null =>
    (assignee
        ? {
            uid: assignee.id,
            displayName: assignee.name,
            username: assignee.username,
            firstName: assignee.firstName,
            surname: assignee.surname,
        }
        : null);

const valueConvertersForType = {
    [dataElementTypes.NUMBER]: stringifyNumber,
    [dataElementTypes.NUMBER_RANGE]: (value: RangeValue) => convertRange(stringifyNumber, value),
    [dataElementTypes.INTEGER]: stringifyNumber,
    [dataElementTypes.INTEGER_RANGE]: (value: RangeValue) => convertRange(stringifyNumber, value),
    [dataElementTypes.INTEGER_POSITIVE]: stringifyNumber,
    [dataElementTypes.INTEGER_POSITIVE_RANGE]: (value: RangeValue) => convertRange(stringifyNumber, value),
    [dataElementTypes.INTEGER_ZERO_OR_POSITIVE]: stringifyNumber,
    [dataElementTypes.INTEGER_ZERO_OR_POSITIVE_RANGE]: (value: RangeValue) => convertRange(stringifyNumber, value),
    [dataElementTypes.INTEGER_NEGATIVE]: stringifyNumber,
    [dataElementTypes.INTEGER_NEGATIVE_RANGE]: (value: RangeValue) => convertRange(stringifyNumber, value),
    [dataElementTypes.PERCENTAGE]: stringifyNumber,
    [dataElementTypes.DATE]: convertDate,
    [dataElementTypes.DATE_RANGE]: (value: RangeValue) => convertRange(convertDate, value),
    [dataElementTypes.TRUE_ONLY]: () => 'true',
    [dataElementTypes.BOOLEAN]: (rawValue: boolean) => (rawValue ? 'true' : 'false'),
    [dataElementTypes.FILE_RESOURCE]: (rawValue: any) => rawValue.value,
    [dataElementTypes.IMAGE]: (rawValue: any) => rawValue.value,
    [dataElementTypes.COORDINATE]: (rawValue: any) => `[${rawValue.longitude},${rawValue.latitude}]`,
    [dataElementTypes.ORGANISATION_UNIT]: (rawValue: any) => rawValue.id,
    [dataElementTypes.AGE]: (rawValue: any) => convertDate(rawValue),
    [dataElementTypes.ASSIGNEE]: convertAssigneeToServer,
};

export function convertValue(value: any, type: keyof typeof dataElementTypes) {
    if (!value && value !== 0 && value !== false) {
        return value;
    }
    return (valueConvertersForType[type] ? valueConvertersForType[type](value) : value);
}

export function convertCategoryOptionsToServer(
    value: {[categoryId: string]: string} | string,
) {
    if (typeof value === 'object') {
        const categoryObject: any = value;
        return Object.keys(categoryObject).reduce((acc: string[], categoryId) => {
            if (categoryObject[categoryId]) {
                acc.push(categoryObject[categoryId]);
            }
            return acc;
        }, []).join(featureAvailable(FEATURES.newUIDsSeparator) ? ',' : ';');
    }
    return value;
}
