// @flow
import moment from '../utils/moment/momentResolver';
import elementTypes from '../metaData/DataElement/elementTypes';

import { adjustLocalMomentDateToUtc } from '../utils/date/date.utils';
import stringifyNumber from './common/stringifyNumber';

function convertDate(rawValue: string): string {
    const editedDate = rawValue;
    const momentDateLocal = moment(editedDate);
    const momentDateUtc = adjustLocalMomentDateToUtc(momentDateLocal);
    return momentDateUtc.toISOString();
}

export const valueConvertersForType = {
    [elementTypes.NUMBER]: stringifyNumber,
    [elementTypes.INTEGER]: stringifyNumber,
    [elementTypes.INTEGER_POSITIVE]: stringifyNumber,
    [elementTypes.INTEGER_ZERO_OR_POSITIVE]: stringifyNumber,
    [elementTypes.INTEGER_NEGATIVE]: stringifyNumber,
    [elementTypes.DATE]: convertDate,
    [elementTypes.TRUE_ONLY]: () => 'true',
    [elementTypes.BOOLEAN]: (rawValue: boolean) => (rawValue ? 'true' : 'false'),
};
