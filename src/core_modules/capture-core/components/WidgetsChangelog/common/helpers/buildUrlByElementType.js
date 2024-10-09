// @flow
import { dataElementTypes } from '../../../../metaData';

const buildTEAUrlByElementType: {|
    [string]: Function,
|} = {
    [dataElementTypes.FILE_RESOURCE]: ({
        trackedEntity,
        id,
        programId,
    }: {
        trackedEntity: string,
        id: string,
        programId: string,
    }) => ({
        url: `/tracker/trackedEntities/${trackedEntity}/attributes/${id}/file?program=${programId}`,
    }),
    [dataElementTypes.IMAGE]: ({
        trackedEntity,
        id,
        programId,
    }: {
        trackedEntity: string,
        id: string,
        programId: string,
    }) => ({
        imageUrl: `/tracker/trackedEntities/${trackedEntity}/attributes/${id}/image?program=${programId}`,
        previewUrl: `/tracker/trackedEntities/${trackedEntity}/attributes/${id}/image?program=${programId}&dimension=small`,
    }),
};

const buildDataElementUrlByElementType: {|
    [string]: Function,
|} = {
    [dataElementTypes.FILE_RESOURCE]: ({ event, id }: { event: string, id: string }) => ({
        url: `/tracker/events/${event}/dataValues/${id}/file`,
    }),
    [dataElementTypes.IMAGE]: ({ event, id }: { event: string, id: string }) => ({
        imageUrl: `/tracker/events/${event}/dataValues/${id}/image`,
        previewUrl: `/tracker/events/${event}/dataValues/${id}/image?dimension=small`,
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
