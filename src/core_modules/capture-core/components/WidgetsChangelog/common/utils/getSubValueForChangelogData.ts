import log from 'loglevel';
import i18n from '@dhis2/d2-i18n';
import { errorCreator } from 'capture-core-utils';
import { dataElementTypes } from '../../../../metaData';
import type { QuerySingleResource } from '../../../../utils/api';

type SubValueTEAProps = {
    trackedEntity: { teiId: string; value: any };
    attributeId: string;
    programId: string;
    absoluteApiPath: string;
    querySingleResource: QuerySingleResource;
    latestValue?: boolean;
};

type SubValuesDataElementProps = {
    dataElement: { id: string; value: any };
    querySingleResource: QuerySingleResource;
    eventId: string;
    absoluteApiPath: string;
    latestValue?: boolean;
};

const buildTEAUrlByElementType: {
    [key: string]: (props: SubValueTEAProps) => Promise<any>;
} = {
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
            if (!latestValue) {
                return i18n.t('File');
            }

            const { id, displayName: name } = await querySingleResource({ resource: `fileResources/${value}` });

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
            if (!latestValue) {
                return i18n.t('Image');
            }
            const { id, displayName: name } = await querySingleResource({ resource: `fileResources/${value}` });

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

const buildDataElementUrlByElementType: {
    [key: string]: (props: SubValuesDataElementProps) => Promise<any>;
} = {
    [dataElementTypes.FILE_RESOURCE]: async ({
        dataElement,
        querySingleResource,
        eventId,
        absoluteApiPath,
        latestValue,
    }: SubValuesDataElementProps) => {
        const { id: dataElementId, value } = dataElement;
        if (!value) return null;

        try {
            if (!latestValue) {
                return i18n.t('File');
            }

            const { id, displayName: name } = await querySingleResource({ resource: `fileResources/${value}` });

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
    [dataElementTypes.IMAGE]: async ({
        dataElement,
        querySingleResource,
        eventId,
        absoluteApiPath,
        latestValue,
    }: SubValuesDataElementProps) => {
        const { id: dataElementId, value } = dataElement;
        if (!value) return null;

        try {
            if (!latestValue) {
                return i18n.t('Image');
            }

            const { id, displayName: name } = await querySingleResource({ resource: `fileResources/${value}` });

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
