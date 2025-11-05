import { featureAvailable, FEATURES } from 'capture-core-utils';
import { dataElementTypes } from '../../../../../../../metaData';

const buildTEAUrlByElementType: {
    [key: string]: any;
} = {
    [dataElementTypes.FILE_RESOURCE]: ({
        trackedEntity,
        id,
        programId,
    }: {
        trackedEntity: string,
        id: string,
        programId: string,
    }) =>
        (featureAvailable(FEATURES.trackerFileEndpoint)
            ? { fileUrl: `/tracker/trackedEntities/${trackedEntity}/attributes/${id}/file?program=${programId}` }
            : { fileUrl: `/trackedEntityInstances/${trackedEntity}/${id}/file` }
        ),
    [dataElementTypes.IMAGE]: ({
        trackedEntity,
        id,
        programId,
    }: {
        trackedEntity: string,
        id: string,
        programId: string,
    }) =>
        (featureAvailable(FEATURES.trackerImageEndpoint)
            ? {
                imageUrl: `/tracker/trackedEntities/${trackedEntity}/attributes/${id}/image?program=${programId}`,
                previewUrl: `/tracker/trackedEntities/${trackedEntity}/attributes/${id}/image` +
                    `?program=${programId}&dimension=small`,
            }
            : {
                imageUrl: `/trackedEntityInstances/${trackedEntity}/${id}/image?program=${programId}`,
                previewUrl: `/trackedEntityInstances/${trackedEntity}/${id}/image?program=${programId}&dimension=SMALL`,
            }),
};

const buildDataElementUrlByElementType: {
    [key: string]: any;
} = {
    [dataElementTypes.FILE_RESOURCE]: ({ event, id }: { event: string, id: string }) =>
        (featureAvailable(FEATURES.trackerFileEndpoint)
            ? { fileUrl: `/tracker/events/${event}/dataValues/${id}/file` }
            : { fileUrl: `/events/files?dataElementUid=${id}&eventUid=${event}` }
        ),
    [dataElementTypes.IMAGE]: ({ event, id }: { event: string, id: string }) =>
        (featureAvailable(FEATURES.trackerImageEndpoint)
            ? {
                imageUrl: `/tracker/events/${event}/dataValues/${id}/image`,
                previewUrl: `/tracker/events/${event}/dataValues/${id}/image?dimension=small`,
            }
            : {
                imageUrl: `/events/files?dataElementUid=${id}&eventUid=${event}`,
                previewUrl: `/events/files?dataElementUid=${id}&eventUid=${event}&dimension=SMALL`,
            }),
};

export const RECORD_TYPE = Object.freeze({
    event: 'event',
    trackedEntity: 'trackedEntity',
});

export const buildUrlByElementType = Object.freeze({
    [RECORD_TYPE.trackedEntity]: buildTEAUrlByElementType,
    [RECORD_TYPE.event]: buildDataElementUrlByElementType,
});
