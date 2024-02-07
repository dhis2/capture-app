// @flow
import log from 'loglevel';
import { errorCreator, hasAPISupportForFeature, FEATURES } from 'capture-core-utils';
import { dataElementTypes, DataElement } from '../../../../../metaData';

const isMultiTextInUnsupportedBackendVersion = (type, minorServerVersion: number) =>
    type === dataElementTypes.MULTI_TEXT && !hasAPISupportForFeature(minorServerVersion, FEATURES.multiText);

export const handleMultiTextInUnsupportedBackendVersions = (dataElement: DataElement, minorServerVersion: number) => {
    if (isMultiTextInUnsupportedBackendVersion(dataElement.type, minorServerVersion)) {
        log.error(errorCreator(
            `MULTI_TEXT is only supported from version 41. You are currently on version ${minorServerVersion}.`,
        )({ dataElement }));
        dataElement.type = dataElementTypes.TEXT;
    }
    return dataElement;
};
