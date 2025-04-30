// @flow
import { typeKeys } from './typeKeys.const';

export const mapTypeToInterfaceFnName = {
    [typeKeys.TEXT]: 'convertText',
    [typeKeys.MULTI_TEXT]: 'convertMultiText',
    [typeKeys.LONG_TEXT]: 'convertLongText',
    [typeKeys.LETTER]: 'convertLetter',
    [typeKeys.PHONE_NUMBER]: 'convertPhoneNumber',
    [typeKeys.EMAIL]: 'convertEmail',
    [typeKeys.BOOLEAN]: 'convertBoolean',
    [typeKeys.TRUE_ONLY]: 'convertTrueOnly',
    [typeKeys.DATE]: 'convertDate',
    [typeKeys.DATETIME]: 'convertDateTime',
    [typeKeys.TIME]: 'convertTime',
    [typeKeys.NUMBER]: 'convertNumber',
    [typeKeys.INTEGER]: 'convertInteger',
    [typeKeys.INTEGER_POSITIVE]: 'convertIntegerPositive',
    [typeKeys.INTEGER_NEGATIVE]: 'convertIntegerNegative',
    [typeKeys.INTEGER_ZERO_OR_POSITIVE]: 'convertIntegerZeroOrPositive',
    [typeKeys.PERCENTAGE]: 'convertPercentage',
    [typeKeys.URL]: 'convertUrl',
    [typeKeys.AGE]: 'convertAge',
    [typeKeys.FILE_RESOURCE]: 'convertFile',
    [typeKeys.ORGANISATION_UNIT]: 'convertOrganisationUnit',
    [typeKeys.IMAGE]: 'convertImage',
    [typeKeys.USERNAME]: 'convertUserName',
    [typeKeys.COORDINATE]: 'convertCoordinate',
};
