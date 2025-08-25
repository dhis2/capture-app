import { dataElementTypes } from '../metaData';
import { convertValue as convertToServerValue } from '../converters/clientToServer';
import { convertValue as convertToClientValue } from '../converters/serverToClient';

type ConverterFn = (value: any, type: keyof typeof dataElementTypes) => any;

type InputCompareKeys = {
    enrolledAt?: string | null;
    occurredAt?: string | null;
};

type CompareKeys = {
    enrolledAt: string;
    occurredAt: string;
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
    enrollment: any,
    onConvertValue: ConverterFn,
    keyMap: any = {},
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

export function convertEnrollmentClientToServerWithKeysMap(enrollment: any) {
    return convertEnrollment(enrollment, convertToServerValue, mapEnrollmentClientKeyToServerKey);
}

const mapEnrollmentServerKeyToClientKey = {
    enrollment: 'enrollmentId',
    program: 'programId',
    programStage: 'programStageId',
    orgUnit: 'orgUnitId',
};

export function convertEnrollmentServerToClientWithKeysMap(enrollment: any) {
    return convertEnrollment(enrollment, convertToClientValue, mapEnrollmentServerKeyToClientKey);
}
