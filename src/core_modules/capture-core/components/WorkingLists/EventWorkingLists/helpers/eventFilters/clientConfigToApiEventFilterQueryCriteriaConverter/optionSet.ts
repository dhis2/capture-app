import moment from 'moment';
import { dataElementTypes } from '../../../../../../metaData';
import type { OptionSetFilterData } from '../../../../../ListView';

const stringifyNumber = (rawValue: number) => rawValue.toString();

const convertDate = (rawValue: string): string => {
    const momentDate = moment(rawValue);
    momentDate.locale('en');
    return momentDate.format('YYYY-MM-DD');
};

const converterByType: any = {
    [dataElementTypes.NUMBER]: stringifyNumber,
    [dataElementTypes.INTEGER]: stringifyNumber,
    [dataElementTypes.INTEGER_POSITIVE]: stringifyNumber,
    [dataElementTypes.INTEGER_ZERO_OR_POSITIVE]: stringifyNumber,
    [dataElementTypes.INTEGER_NEGATIVE]: stringifyNumber,
    [dataElementTypes.DATE]: convertDate,
    [dataElementTypes.BOOLEAN]: (rawValue: boolean) => (rawValue ? 'true' : 'false'),
    [dataElementTypes.TRUE_ONLY]: () => 'true',
};

export const getOptionSetFilter = (filter: OptionSetFilterData, type: keyof typeof dataElementTypes) => ({
    in: filter
        .values
        .map(value => (converterByType[type] ? converterByType[type](value) : value.toString()))
        .filter(value => value !== null),
});
