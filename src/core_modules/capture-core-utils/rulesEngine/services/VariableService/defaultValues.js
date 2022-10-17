// @flow
import { typeKeys } from '../../constants';
import type { IDateUtils } from '../../rulesEngine.types';

export const getDefaultValues = (dateUtils: IDateUtils) => ({
    [typeKeys.TEXT]: '',
    [typeKeys.LONG_TEXT]: '',
    [typeKeys.PHONE_NUMBER]: '',
    [typeKeys.EMAIL]: '',
    [typeKeys.BOOLEAN]: null,
    [typeKeys.TRUE_ONLY]: null,
    [typeKeys.DATE]: dateUtils.getToday(),
    [typeKeys.DATETIME]: `${dateUtils.getToday()}T00:00`,
    [typeKeys.TIME]: '00:00',
    [typeKeys.NUMBER]: 0,
    [typeKeys.PERCENTAGE]: 0,
    [typeKeys.INTEGER]: 0,
    [typeKeys.INTEGER_POSITIVE]: 1,
    [typeKeys.INTEGER_NEGATIVE]: -1,
    [typeKeys.INTEGER_ZERO_OR_POSITIVE]: 0,
    [typeKeys.USERNAME]: '',
    [typeKeys.COORDINATE]: '[0.0,0.0]',
    [typeKeys.ORGANISATION_UNIT]: '',
    [typeKeys.AGE]: dateUtils.getToday(),
    [typeKeys.URL]: '',
    [typeKeys.FILE_RESOURCE]: null,
    [typeKeys.IMAGE]: null,
});
