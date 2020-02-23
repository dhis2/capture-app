// @flow
import { moment } from 'capture-core-utils/moment';
import {
    dataElementTypes as elementTypes,
} from '../../../../../../../metaData';

import type {
    ApiDataFilterOptionSet,
} from '../../../workingLists.types';
import type {
    OptionSetFilterData,
} from '../../../../EventsList/eventList.types';

const stringifyNumber = (rawValue: number) => {
    rawValue.toString();
};

const convertDate = (rawValue: string): string => {
    const momentDate = moment(rawValue);
    momentDate.locale('en');
    return momentDate.format('YYYY-MM-DD');
};

const converterByType = {
    [elementTypes.NUMBER]: stringifyNumber,
    [elementTypes.INTEGER]: stringifyNumber,
    [elementTypes.INTEGER_POSITIVE]: stringifyNumber,
    [elementTypes.INTEGER_ZERO_OR_POSITIVE]: stringifyNumber,
    [elementTypes.INTEGER_NEGATIVE]: stringifyNumber,
    [elementTypes.DATE]: convertDate,
    [elementTypes.BOOLEAN]: (rawValue: boolean) => (rawValue ? 'true' : 'false'),
    [elementTypes.TRUE_ONLY]: () => 'true',
};

export const getApiOptionSetFilter =
    (filter: OptionSetFilterData, type: $Values<typeof elementTypes>): ApiDataFilterOptionSet => ({
        in: filter
            .values
            .map(value => (converterByType[type] ? converterByType[type](value) : value.toString())),
    });
