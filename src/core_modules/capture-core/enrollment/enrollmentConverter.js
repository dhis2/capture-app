// @flow
import { dataElementTypes } from '../metaData';
import { convertValue as convertToServerValue } from '../converters/clientToServer';
import { convertValue as convertToClientValue } from '../converters/serverToClient';

type ConverterFn = (type: $Keys<typeof dataElementTypes>, value: any) => any;

type InputCompareKeys = {
    enrolledAt?: ?string,
    occurredAt?: ?string,
};

type CompareKeys = {
    enrolledAt: string,
    occurredAt: string,
};

function getConvertedValue(valueToConvert: any, key: string, onConvertValue: ConverterFn, compareKeys: CompareKeys) {
    let convertedValue;
    if (key === compareKeys.enrolledAt || key === compareKeys.occurredAt) {
        convertedValue = onConvertValue(valueToConvert, dataElementTypes.DATE);
    } else {
        convertedValue = valueToConvert;
    }
    return convertedValue;
}

export function convertEnrollment(
    enrollment: Object,
    onConvertValue: ConverterFn,
    keyMap: Object = {},
    compareKeysMapFromDefault: InputCompareKeys = {}) {
    const calculatedCompareKeys: CompareKeys = {
        enrolledAt: compareKeysMapFromDefault.enrolledAt || 'enrolledAt',
        occurredAt: compareKeysMapFromDefault.occurredAt || 'occurredAt',
    };

    return Object
        .keys(enrollment)
        .reduce((accConvertedEnrollment, key) => {
            const convertedValue = getConvertedValue(enrollment[key], key, onConvertValue, calculatedCompareKeys);
            const outputKey = keyMap[key] || key;
            accConvertedEnrollment[outputKey] = convertedValue;
            return accConvertedEnrollment;
        }, {});
}

const mapEnrollmentClientKeyToServerKey = {
    enrollmentId: 'enrollment',
    programId: 'program',
    programStageId: 'programStage',
    orgUnitId: 'orgUnit',
};

export function convertEnrollmentClientToServerWithKeysMap(enrollment: Object) {
    return convertEnrollment(enrollment, convertToServerValue, mapEnrollmentClientKeyToServerKey);
}

const mapEnrollmentServerKeyToClientKey = {
    enrollment: 'enrollmentId',
    program: 'programId',
    programStage: 'programStageId',
    orgUnit: 'orgUnitId',
};

export function convertEnrollmentServerToClientWithKeysMap(enrollment: Object) {
    return convertEnrollment(enrollment, convertToClientValue, mapEnrollmentServerKeyToClientKey);
}
