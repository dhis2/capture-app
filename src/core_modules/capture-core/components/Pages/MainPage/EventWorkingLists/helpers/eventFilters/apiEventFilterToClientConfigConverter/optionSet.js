// @flow
import { moment } from 'capture-core-utils/moment';
import { parseNumber } from 'capture-core-utils/parsers';
import {
    dataElementTypes as elementTypes,
} from '../../../../../../../metaData';

import type {
    ApiDataFilterOptionSet,
} from '../../../types';
import type {
    OptionSetFilterData,
} from '../../../../../../ListView';


const converterByType = {
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.NUMBER]: parseNumber,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.INTEGER]: parseNumber,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.INTEGER_POSITIVE]: parseNumber,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.INTEGER_ZERO_OR_POSITIVE]: parseNumber,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.INTEGER_NEGATIVE]: parseNumber,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.DATE]: (rawValue: string) => moment(rawValue, 'YYYY-MM-DD').toISOString(),
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.BOOLEAN]: (rawValue: string) => (rawValue === 'true'),
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.TRUE_ONLY]: (rawValue: string) => ((rawValue === 'true') || null),
};

export const getOptionSetFilter =
    (filter: ApiDataFilterOptionSet, type: $Values<typeof elementTypes>): OptionSetFilterData => ({
        usingOptionSet: true,
        values: filter
            .in
            .map(value => (converterByType[type] ? converterByType[type](value) : value)),
    });
