// @flow
import moment from 'moment';
import { parseNumber } from 'capture-core-utils/parsers';
import { dataElementTypes } from '../../../../../../metaData';
import type { OptionSetFilterData } from '../../../../../ListView';

type ApiDataFilterOptionSet = {|
    in: Array<string>,
|};
const converterByType = {
    [dataElementTypes.NUMBER]: parseNumber,
    [dataElementTypes.INTEGER]: parseNumber,
    [dataElementTypes.INTEGER_POSITIVE]: parseNumber,
    [dataElementTypes.INTEGER_ZERO_OR_POSITIVE]: parseNumber,
    [dataElementTypes.INTEGER_NEGATIVE]: parseNumber,
    [dataElementTypes.DATE]: (rawValue: string) => moment(rawValue, 'YYYY-MM-DD').toISOString(),
    [dataElementTypes.BOOLEAN]: (rawValue: string) => rawValue === 'true',
    [dataElementTypes.TRUE_ONLY]: (rawValue: string) => rawValue === 'true' || null,
};

export const getOptionSetFilter = (filter: ApiDataFilterOptionSet, type: $Keys<typeof dataElementTypes>): OptionSetFilterData => ({
    usingOptionSet: true,
    values: filter.in
        // $FlowFixMe dataElementTypes flow error
        .map(value => (converterByType[type] ? converterByType[type](value) : value)),
});
