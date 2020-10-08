// @flow
const unknownTypeCode = 'UNKNOWN';

const elementTypeCodes: Array<string> = [
    'TEXT',
    'LONG_TEXT',
    'NUMBER',
    'NUMBER_RANGE',
    'INTEGER',
    'INTEGER_RANGE',
    'INTEGER_POSITIVE',
    'INTEGER_POSITIVE_RANGE',
    'INTEGER_NEGATIVE',
    'INTEGER_NEGATIVE_RANGE',
    'INTEGER_ZERO_OR_POSITIVE',
    'INTEGER_ZERO_OR_POSITIVE_RANGE',
    'PERCENTAGE',
    'DATE',
    'DATE_RANGE',
    'DATETIME',
    'DATETIME_RANGE',
    'TIME',
    'TIME_RANGE',
    'TRUE_ONLY',
    'BOOLEAN',
    'PHONE_NUMBER',
    'EMAIL',
    'FILE_RESOURCE',
    'URL',
    'ORGANISATION_UNIT',
    'IMAGE',
    'AGE',
    'COORDINATE',
    'POLYGON',
    'USERNAME',
    'ASSIGNEE',
    unknownTypeCode,
];

const elementTypeKeys =
    elementTypeCodes.reduce((accKeys, code) => {
        accKeys[code] = code;
        return accKeys;
    }, {});

export default elementTypeKeys;

