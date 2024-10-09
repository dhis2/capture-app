// @flow
import { dataElementTypes } from '../../../../metaData';

const buildTEAUrlByElementType: {|
    [string]: Function,
|} = {
    [dataElementTypes.FILE_RESOURCE]: ({
        trackedEntity,
        id,
        programId,
        absoluteApiPath,
    }: {
        trackedEntity: string,
        id: string,
        programId: string,
        absoluteApiPath: string,
    }) => ({
        id,
        name: 'test.file',
        value: id,
        url: `${absoluteApiPath}/tracker/trackedEntities/${trackedEntity}/attributes/${id}/file?program=${programId}`,
    }),
    [dataElementTypes.IMAGE]: ({
        trackedEntity,
        id,
        programId,
        absoluteApiPath,
    }: {
        trackedEntity: string,
        id: string,
        programId: string,
        absoluteApiPath: string,
    }) => ({
        imageUrl: `${absoluteApiPath}/tracker/trackedEntities/${trackedEntity}/attributes/${id}/image?program=${programId}`,
        previewUrl: `${absoluteApiPath}/tracker/trackedEntities/${trackedEntity}/attributes/${id}/image?program=${programId}&dimension=small`,
    }),
};

const buildDataElementUrlByElementType: {|
    [string]: Function,
|} = {
    [dataElementTypes.FILE_RESOURCE]: ({ event, id, absoluteApiPath }: { event: string, id: string, absoluteApiPath: string }) => ({
        id,
        name: 'test.file',
        value: id,
        url: `${absoluteApiPath}/tracker/events/${event}/dataValues/${id}/file`,
    }),
    [dataElementTypes.IMAGE]: ({ event, id, absoluteApiPath }: { event: string, id: string, absoluteApiPath: string }) => ({
        imageUrl: `${absoluteApiPath}/tracker/events/${event}/dataValues/${id}/image`,
        previewUrl: `${absoluteApiPath}/tracker/events/${event}/dataValues/${id}/image?dimension=small`,
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
