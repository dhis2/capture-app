// @flow
import log from 'loglevel';
import { errorCreator, featureAvailable, FEATURES } from 'capture-core-utils';
import { dataElementTypes, DataElement } from '../../../../../metaData';

const isMultiTextInUnsupportedBackendVersion = type =>
    type === dataElementTypes.MULTI_TEXT && !featureAvailable(FEATURES.multiText);

export const handleMultiTextInUnsupportedBackendVersions = (dataElement: DataElement, minorServerVersion: number) => {
    if (isMultiTextInUnsupportedBackendVersion(dataElement.type)) {
        log.error(errorCreator(
            `MULTI_TEXT is only supported from version 2.41. You are currently on version ${minorServerVersion}.`,
        )({ dataElement }));
        dataElement.type = dataElementTypes.TEXT;
    }
    return dataElement;
};
