// @flow
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { isMultiTextWithoutOptionset } from './isMultiTextWithoutOptionset';
import { handleMultiTextInUnsupportedBackendVersions } from './handleMultiTextInUnsupportedBackendVersions';
import type { DataElement } from '../../../../../metaData';

export const handleUnsupportedMultiText = (dataElement: DataElement, minorServerVersion: number) => {
    if (isMultiTextWithoutOptionset(dataElement.type, dataElement.optionSet)) {
        log.error(errorCreator('MULTI_TEXT without optionset is not supported')({ dataElement }));
        return null;
    }
    return handleMultiTextInUnsupportedBackendVersions(dataElement, minorServerVersion);
};
