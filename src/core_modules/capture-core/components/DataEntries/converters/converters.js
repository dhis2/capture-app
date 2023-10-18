// @flow
import type { RenderFoundation } from '../../../metaData';

export function convertGeometryOut(dataEntryValue: any, foundation: RenderFoundation, customFeatureType: string) {
    const featureType = customFeatureType || foundation.featureType;
    if (!dataEntryValue || !['Polygon', 'Point'].includes(featureType)) return null;
    let coordinates = dataEntryValue;
    if (featureType === 'Point') {
        coordinates = [dataEntryValue.longitude, dataEntryValue.latitude];
    }
    return {
        type: featureType,
        coordinates,
    };
}

export function getConvertGeometryIn(foundation: ?RenderFoundation) {
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

export function convertStatusOut(dataEntryValue: string) {
    return dataEntryValue === 'true' ? 'COMPLETED' : 'ACTIVE';
}

export function convertNoteOut(dataEntryValue: string) {
    return dataEntryValue ? [{ value: dataEntryValue }] : [];
}

export function convertNoteIn(dataEntryValue: any) {
    if (Array.isArray(dataEntryValue) && dataEntryValue.length > 0) {
        return dataEntryValue[0].value;
    }
    return null;
}
