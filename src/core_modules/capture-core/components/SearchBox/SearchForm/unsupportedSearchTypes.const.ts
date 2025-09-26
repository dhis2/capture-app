import { dataElementTypes } from '../../../metaData';

/**
 * Attribute types that are not supported for searching in the Capture app.
 * These types cannot be properly converted for search queries or don't have meaningful search behavior.
 */
export const UNSUPPORTED_SEARCH_ATTRIBUTE_TYPES = new Set([
    dataElementTypes.LETTER,
    dataElementTypes.UNIT_INTERVAL,
    dataElementTypes.TRACKER_ASSOCIATE,
    dataElementTypes.REFERENCE,
    dataElementTypes.UNKNOWN,
    dataElementTypes.COORDINATE,
    dataElementTypes.POLYGON,
    dataElementTypes.IMAGE,
    dataElementTypes.FILE_RESOURCE,
    dataElementTypes.STATUS,
    dataElementTypes.GEOJSON,
    dataElementTypes.URL,
] as const);

export const isSearchSupportedAttributeType = (valueType: string): boolean =>
    !UNSUPPORTED_SEARCH_ATTRIBUTE_TYPES.has(valueType as any);
