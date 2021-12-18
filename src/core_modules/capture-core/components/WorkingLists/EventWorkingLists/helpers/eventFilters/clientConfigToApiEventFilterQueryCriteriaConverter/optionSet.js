// @flow
import moment from 'moment';
import { dataElementTypes } from '../../../../../../metaData';

import type {
    ApiDataFilterOptionSet,
} from '../../../types';
import type {
    OptionSetFilterData,
} from '../../../../WorkingListsBase';

const stringifyNumber = (rawValue: number) => rawValue.toString();

const convertDate = (rawValue: string): string => {
    const momentDate = moment(rawValue);
    momentDate.locale('en');
    return momentDate.format('YYYY-MM-DD');
};

const converterByType = {
    [dataElementTypes.NUMBER]: stringifyNumber,
    [dataElementTypes.INTEGER]: stringifyNumber,
    [dataElementTypes.INTEGER_POSITIVE]: stringifyNumber,
    [dataElementTypes.INTEGER_ZERO_OR_POSITIVE]: stringifyNumber,
    [dataElementTypes.INTEGER_NEGATIVE]: stringifyNumber,
    [dataElementTypes.DATE]: convertDate,
    [dataElementTypes.BOOLEAN]: (rawValue: boolean) => (rawValue ? 'true' : 'false'),
    [dataElementTypes.TRUE_ONLY]: () => 'true',
};

export const getApiOptionSetFilter =
    (filter: OptionSetFilterData, type: $Keys<typeof dataElementTypes>): ApiDataFilterOptionSet => ({
        in: filter
            .values
            // $FlowFixMe dataElementTypes flow error
            .map(value => (converterByType[type] ? converterByType[type](value) : value.toString())),
    });
