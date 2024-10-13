// @flow
import { dataElementTypes } from '../../../../metaData';
import type { QuerySingleResource } from '../../../../utils/api';


type subValueTEAProps = {
    trackedEntity: Object,
    attributeId: string,
    programId: string,
    absoluteApiPath: string,
    querySingleResource: QuerySingleResource,
    isPreviousValue?: boolean,
};

type SubValuesDataElementProps = {
    dataElement: Object,
    querySingleResource: QuerySingleResource,
    eventId: string,
    absoluteApiPath: string,
    isPreviousValue?: boolean,
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
        isPreviousValue,
    }: subValueTEAProps) => {
        const { teiId, value } = trackedEntity;
        if (!value) return null;
        const { id, displayName: name } = await querySingleResource({ resource: `fileResources/${value}` });

        if (isPreviousValue) {
            return name;
        }

        return {
            id,
            name,
            url: `${absoluteApiPath}/tracker/trackedEntities/${teiId}/attributes/${attributeId}/file?program=${programId}`,
        };
    },
    [dataElementTypes.IMAGE]: async ({
        trackedEntity,
        attributeId,
        programId,
        absoluteApiPath,
        isPreviousValue,
        querySingleResource,
    }: subValueTEAProps) => {
        const { teiId, value } = trackedEntity;
        if (!value) return null;
        const { id, displayName: name } = await querySingleResource({ resource: `fileResources/${value}` });

        if (isPreviousValue) {
            return name;
        }

        return {
            id,
            name,
            url: `${absoluteApiPath}/tracker/trackedEntities/${teiId}/attributes/${attributeId}/image?program=${programId}`,
            previewUrl: `${absoluteApiPath}/tracker/trackedEntities/${teiId}/attributes/${attributeId}/image?program=${programId}&dimension=small`,
        };
    },
};


const buildDataElementUrlByElementType: {|
[string]: Function,
|} = {
    [dataElementTypes.FILE_RESOURCE]: async ({ dataElement, querySingleResource, eventId, absoluteApiPath, isPreviousValue }: SubValuesDataElementProps) => {
        const { id: dataElementId, value } = dataElement;
        if (!value) return null;

        const { id, displayName: name } = await querySingleResource({ resource: `fileResources/${value}` });

        if (isPreviousValue) {
            return name;
        }

        return {
            id,
            name,
            url: `${absoluteApiPath}/tracker/events/${eventId}/dataValues/${dataElementId}/file`,
        };
    },
    [dataElementTypes.IMAGE]: async ({ dataElement, querySingleResource, eventId, absoluteApiPath, isPreviousValue }: SubValuesDataElementProps) => {
        const { id: dataElementId, value } = dataElement;
        if (!value) return null;

        const { id, displayName: name } = await querySingleResource({ resource: `fileResources/${value}` });

        if (isPreviousValue) {
            return name;
        }

        return {
            id,
            name,
            url: `${absoluteApiPath}/tracker/events/${eventId}/dataValues/${dataElementId}/image`,
            previewUrl: `${absoluteApiPath}/tracker/events/${eventId}/dataValues/${dataElementId}/image?dimension=small`,
        };
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
