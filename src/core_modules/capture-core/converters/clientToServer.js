// @flow
import moment from 'moment';
import { dataElementTypes } from '../metaData';
import { stringifyNumber } from './common/stringifyNumber';
import { FEATURES, hasAPISupportForFeature } from '../../capture-core-utils';

type RangeValue = {
    from: number,
    to: number,
}

type Assignee = {
    id: string,
    username: string,
    name: string,
    firstName: string,
    surname: string,
}

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
    [dataElementTypes.FILE_RESOURCE]: (rawValue: Object) => rawValue.value,
    [dataElementTypes.IMAGE]: (rawValue: Object) => rawValue.value,
    [dataElementTypes.COORDINATE]: (rawValue: Object) => `[${rawValue.longitude},${rawValue.latitude}]`,
    [dataElementTypes.ORGANISATION_UNIT]: (rawValue: Object) => rawValue.id,
    [dataElementTypes.AGE]: (rawValue: Object) => convertDate(rawValue),
    [dataElementTypes.ASSIGNEE]: convertAssigneeToServer,
};

export function convertValue(value: any, type: $Keys<typeof dataElementTypes>) {
    if (!value && value !== 0 && value !== false) {
        return value;
    }
    // $FlowFixMe dataElementTypes flow error
    return (valueConvertersForType[type] ? valueConvertersForType[type](value) : value);
}

export function convertCategoryOptionsToServer(
    value: {[categoryId: string]: string} | string,
    serverMinorVersion: number,
) {
    if (typeof value === 'object') {
        const categoryObject: Object = value;
        return Object.keys(categoryObject).reduce((acc, categoryId) => {
            if (value[categoryId]) {
                acc.push(value[categoryId]);
            }
            return acc;
        }, []).join(hasAPISupportForFeature(serverMinorVersion, FEATURES.newAocApiSeparator) ? ',' : ';');
    }
    return value;
}
