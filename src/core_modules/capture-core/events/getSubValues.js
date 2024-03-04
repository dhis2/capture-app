// @flow
import log from 'loglevel';
import isDefined from 'd2-utilizr/lib/isDefined';
import { errorCreator, featureAvailable, FEATURES } from 'capture-core-utils';
import { type RenderFoundation, dataElementTypes } from '../metaData';
import type { QuerySingleResource } from '../utils/api/api.types';

const GET_SUBVALUE_ERROR = 'Could not get subvalue';

const subValueGetterByElementType = {
    // todo (report lgmt)
    [dataElementTypes.FILE_RESOURCE]: (
        {
            value,
            eventId,
            metaElementId,
            absoluteApiPath,
            querySingleResource,
        }: {
            value: any,
            eventId: string,
            metaElementId: string,
            absoluteApiPath: string,
            querySingleResource: QuerySingleResource,
        }) =>
        querySingleResource({ resource: `fileResources/${value}` })
            .then(res =>
                ({
                    name: res.name,
                    value: res.id,
                    url: `${absoluteApiPath}/events/files?dataElementUid=${metaElementId}&eventUid=${eventId}`,
                }))
            .catch((error) => {
                log.warn(errorCreator(GET_SUBVALUE_ERROR)({ value, eventId, metaElementId, error }));
                return null;
            }),
    [dataElementTypes.IMAGE]: ({
        value,
        eventId,
        metaElementId,
        absoluteApiPath,
        querySingleResource,
    }: {
        value: any,
        eventId: string,
        metaElementId: string,
        absoluteApiPath: string,
        querySingleResource: QuerySingleResource,
    }) =>
        querySingleResource({ resource: `fileResources/${value}` })
            .then(res =>
                ({
                    name: res.name,
                    value: res.id,
                    ...(featureAvailable(FEATURES.trackerImageEndpoint) ?
                        {
                            url: `${absoluteApiPath}/tracker/events/${eventId}/dataValues/${metaElementId}/image`,
                            previewUrl: `${absoluteApiPath}/tracker/events/${eventId}/dataValues/${metaElementId}/image?dimension=small`,
                        } : {
                            url: `${absoluteApiPath}/events/files?dataElementUid=${metaElementId}&eventUid=${eventId}`,
                            previewUrl: `${absoluteApiPath}/events/files?dataElementUid=${metaElementId}&eventUid=${eventId}`,
                        }
                    ),
                }))
            .catch((error) => {
                log.warn(errorCreator(GET_SUBVALUE_ERROR)({ value, eventId, metaElementId, error }));
                return null;
            }),
    [dataElementTypes.ORGANISATION_UNIT]: ({
        value,
        eventId,
        metaElementId,
        querySingleResource,
    }: {
        value: any,
        eventId: string,
        metaElementId: string,
        querySingleResource: QuerySingleResource
    }) => {
        const ouIds = value.split('/');
        const id = ouIds[ouIds.length - 1];
        return querySingleResource({ resource: 'organisationUnits',
            id,
            params: {
                fields: 'id,code,displayName,path',
            } })
            .then(res => ({
                id: res.id,
                code: res.code,
                name: res.displayName,
                path: res.path,
            }))
            .catch((error) => {
                log.warn(errorCreator(GET_SUBVALUE_ERROR)({ value, eventId, metaElementId, error }));
                return null;
            });
    },
};

export async function getSubValues({
    eventId,
    programStage,
    values,
    absoluteApiPath,
    querySingleResource,
}: {
    eventId: string,
    programStage: RenderFoundation,
    values?: ?Object,
    absoluteApiPath: string,
    querySingleResource: QuerySingleResource,
}) {
    if (!values) {
        return null;
    }

    const elementsById = programStage.getElementsById();

    return Object.keys(values).reduce(async (accValuesPromise, metaElementId) => {
        const accValues = await accValuesPromise;

        const value = values[metaElementId];
        const metaElement = elementsById[metaElementId];
        if (isDefined(value) && value !== null && metaElement) {
            // $FlowFixMe dataElementTypes flow error
            const subValueGetter = subValueGetterByElementType[metaElement.type];
            if (subValueGetter) {
                const subValue = await subValueGetter({
                    value,
                    eventId,
                    metaElementId,
                    absoluteApiPath,
                    querySingleResource,
                });
                accValues[metaElementId] = subValue;
            }
        }
        return accValues;
    }, Promise.resolve(values));
}
