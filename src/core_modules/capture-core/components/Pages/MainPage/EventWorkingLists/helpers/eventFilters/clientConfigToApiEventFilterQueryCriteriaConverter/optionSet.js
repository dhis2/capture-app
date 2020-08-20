// @flow
import { moment } from 'capture-core-utils/moment';
import {
    dataElementTypes as elementTypes,
} from '../../../../../../../metaData';

import type {
    ApiDataFilterOptionSet,
} from '../../../types';
import type {
    OptionSetFilterData,
} from '../../../../WorkingLists';

const stringifyNumber = (rawValue: number) => {
    rawValue.toString();
};

const convertDate = (rawValue: string): string => {
    const momentDate = moment(rawValue);
    momentDate.locale('en');
    return momentDate.format('YYYY-MM-DD');
};

const converterByType = {
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.NUMBER]: stringifyNumber,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.INTEGER]: stringifyNumber,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.INTEGER_POSITIVE]: stringifyNumber,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.INTEGER_ZERO_OR_POSITIVE]: stringifyNumber,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.INTEGER_NEGATIVE]: stringifyNumber,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.DATE]: convertDate,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.BOOLEAN]: (rawValue: boolean) => (rawValue ? 'true' : 'false'),
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.TRUE_ONLY]: () => 'true',
};

export const getApiOptionSetFilter =
    (filter: OptionSetFilterData, type: $Values<typeof elementTypes>): ApiDataFilterOptionSet => ({
        in: filter
            .values
            .map(value => (converterByType[type] ? converterByType[type](value) : value.toString())),
    });
