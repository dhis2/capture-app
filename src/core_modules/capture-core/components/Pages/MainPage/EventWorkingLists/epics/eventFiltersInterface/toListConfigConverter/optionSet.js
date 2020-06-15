// @flow
import { moment } from 'capture-core-utils/moment';
import { parseNumber } from 'capture-core-utils/parsers';
import {
    dataElementTypes as elementTypes,
} from '../../../../../../../metaData';

import type {
    ApiDataFilterOptionSet,
} from '../../../workingLists.types';
import type {
    OptionSetFilterData,
} from '../../../../../../ListView';


const converterByType = {
    [elementTypes.NUMBER]: parseNumber,
    [elementTypes.INTEGER]: parseNumber,
    [elementTypes.INTEGER_POSITIVE]: parseNumber,
    [elementTypes.INTEGER_ZERO_OR_POSITIVE]: parseNumber,
    [elementTypes.INTEGER_NEGATIVE]: parseNumber,
    [elementTypes.DATE]: (rawValue: string) => moment(rawValue, 'YYYY-MM-DD').toISOString(),
    [elementTypes.BOOLEAN]: (rawValue: string) => (rawValue === 'true'),
    [elementTypes.TRUE_ONLY]: (rawValue: string) => ((rawValue === 'true') || null),
};

export const getOptionSetFilter =
    (filter: ApiDataFilterOptionSet, type: $Values<typeof elementTypes>): OptionSetFilterData => ({
        usingOptionSet: true,
        values: filter
            .in
            .map(value => (converterByType[type] ? converterByType[type](value) : value)),
    });
