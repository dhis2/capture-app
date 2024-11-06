// @flow
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { dataElementTypes } from '../../../../metaData';
import type { QuerySingleResource } from '../../../../utils/api';

type SubValueTEAProps = {
    trackedEntity: Object,
    attributeId: string,
    programId: string,
    absoluteApiPath: string,
    querySingleResource: QuerySingleResource,
    latestValue?: boolean,
};

type SubValuesDataElementProps = {
    dataElement: Object,
    querySingleResource: QuerySingleResource,
    eventId: string,
    absoluteApiPath: string,
    latestValue?: boolean,
};

const buildTEAUrlByElementType: {|
[string]: Function,
|} = {
    [dataElementTypes.FILE_RESOURCE]: async ({
        trackedEntity,
        attributeId,
        programId,
        absoluteApiPath,
        querySingleResource,
        latestValue,
    }: SubValueTEAProps) => {
        const { teiId, value } = trackedEntity;
        if (!value) return null;
        try {
            const { id, displayName: name } = await querySingleResource({ resource: `fileResources/${value}` });

            if (!latestValue) {
                return 'File';
            }

            return {
                id,
                name,
                url: `${absoluteApiPath}/tracker/trackedEntities/${teiId}/attributes/${attributeId}/file?program=${programId}`,
            };
        } catch (error) {
            log.error(
                errorCreator('Error fetching file resource')({ error }),
            );
            return null;
        }
    },
    [dataElementTypes.IMAGE]: async ({
        trackedEntity,
        attributeId,
        programId,
        absoluteApiPath,
        latestValue,
        querySingleResource,
    }: SubValueTEAProps) => {
        const { teiId, value } = trackedEntity;
        if (!value) return null;
        try {
            const { id, displayName: name } = await querySingleResource({ resource: `fileResources/${value}` });

            if (!latestValue) {
                return 'Image';
            }

            return {
                id,
                name,
                url: `${absoluteApiPath}/tracker/trackedEntities/${teiId}/attributes/${attributeId}/image?program=${programId}`,
                previewUrl: `${absoluteApiPath}/tracker/trackedEntities/${teiId}/attributes/${attributeId}/image?program=${programId}&dimension=small`,
            };
        } catch (error) {
            log.error(
                errorCreator('Error fetching image resource')({ error }),
            );
            return null;
        }
    },
};

const buildDataElementUrlByElementType: {|
[string]: Function,
|} = {
    [dataElementTypes.FILE_RESOURCE]: async ({ dataElement, querySingleResource, eventId, absoluteApiPath, latestValue }: SubValuesDataElementProps) => {
        const { id: dataElementId, value } = dataElement;
        if (!value) return null;

        try {
            const { id, displayName: name } = await querySingleResource({ resource: `fileResources/${value}` });

            if (!latestValue) {
                return 'File';
            }

            return {
                id,
                name,
                url: `${absoluteApiPath}/tracker/events/${eventId}/dataValues/${dataElementId}/file`,
            };
        } catch (error) {
            log.error(
                errorCreator('Error fetching file resource')({ error }),
            );
            return null;
        }
    },
    [dataElementTypes.IMAGE]: async ({ dataElement, querySingleResource, eventId, absoluteApiPath, latestValue }: SubValuesDataElementProps) => {
        const { id: dataElementId, value } = dataElement;
        if (!value) return null;

        try {
            const { id, displayName: name } = await querySingleResource({ resource: `fileResources/${value}` });

            if (!latestValue) {
                return 'Image';
            }

            return {
                id,
                name,
                url: `${absoluteApiPath}/tracker/events/${eventId}/dataValues/${dataElementId}/image`,
                previewUrl: `${absoluteApiPath}/tracker/events/${eventId}/dataValues/${dataElementId}/image?dimension=small`,
            };
        } catch (error) {
            log.error(
                errorCreator('Error fetching image resource')({ error }),
            );
            return null;
        }
    },
};

export const RECORD_TYPE = Object.freeze({
    event: 'event',
    trackedEntity: 'trackedEntity',
});

export const subValueGetterByElementType = Object.freeze({
    [RECORD_TYPE.trackedEntity]: buildTEAUrlByElementType,
    [RECORD_TYPE.event]: buildDataElementUrlByElementType,
});
