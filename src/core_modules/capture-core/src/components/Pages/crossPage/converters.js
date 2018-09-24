// @flow
import RenderFoundation from '../../../metaData/RenderFoundation/RenderFoundation';

export function convertCoordinateOut(dataEntryValue: any, prevValue: string, foundation: RenderFoundation) {
    let coordinates = dataEntryValue;
    if (foundation.featureType === 'Point') {
        coordinates = [dataEntryValue.longitude, dataEntryValue.latitude];
    }
    return dataEntryValue ? {
        type: foundation.featureType,
        coordinates,
    } : null;
}

export function getConvertCoordinateIn(foundation: ?RenderFoundation) {
    return (value: any) => {
        if (!value || !foundation || value.type !== foundation.featureType) {
            return null;
        }
        if (foundation.featureType === 'Point') {
            return { latitude: value.coordinates[1], longitude: value.coordinates[0] };
        }
        return value.coordinates;
    };
}

export function convertStatusIn(value: string) {
    if (value === 'COMPLETED') {
        return 'true';
    }
    return null;
}

export function convertStatusOut(dataEntryValue: string, prevValue: string) {
    if (dataEntryValue === 'true' && prevValue !== 'COMPLETED') {
        return 'COMPLETED';
    }

    if (!dataEntryValue && prevValue === 'COMPLETED') {
        return 'ACTIVE';
    }
    return prevValue;
}

export function convertNoteOut(dataEntryValue: string, prevValue: string) {
    return dataEntryValue ? [{ value: dataEntryValue }] : [];
}

export function convertNoteIn(dataEntryValue: any) {
    if (Array.isArray(dataEntryValue) && dataEntryValue.length > 0) {
        return dataEntryValue[0].value;
    }
    return null;
}
