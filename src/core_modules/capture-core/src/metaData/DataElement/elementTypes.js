// @flow
const unknownTypeCode = 'UNKNOWN';

const elementTypeCodes = [
    'TEXT',
    'LONG_TEXT',
    'NUMBER',
    'INTEGER',
    'INTEGER_POSITIVE',
    'INTEGER_NEGATIVE',
    'INTEGER_ZERO_OR_POSITIVE',
    'PERCENTAGE',
    'DATE',
    'DATETIME',
    'TIME',
    'TRUE_ONLY',
    'BOOLEAN',
    'ACCOUNTNUMBER',
    'PHONE_NUMBER',
    'EMAIL',
    'ZIPCODE',
    'PASSWORD',
    'DURATION_MINUTES',
    'FILE_RESOURCE',
    'URL',
    'ORGANISATION_UNIT',
    'IMAGE',
    'AGE',
    'COORDINATE',
    'USERNAME',
    unknownTypeCode,
];

const elementTypeKeys = elementTypeCodes.reduce((accKeys, code) => {
    accKeys[code] = code;
    return accKeys;
}, {});

export default elementTypeKeys;

