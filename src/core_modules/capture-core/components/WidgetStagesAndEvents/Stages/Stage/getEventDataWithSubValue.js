// @flow
import { featureAvailable, FEATURES } from 'capture-core-utils';
import { dataElementTypes } from '../../../../metaData';
import type { QuerySingleResource } from '../../../../utils/api/api.types';

const getFileResourceSubvalue = async (keys: Object, querySingleResource: QuerySingleResource, eventId: string, absoluteApiPath: string) => {
    const promises = Object.keys(keys)
        .map(async (key) => {
            const value = keys[key];
            if (value) {
                const { id, displayName: name } = await querySingleResource({ resource: `fileResources/${value}` });
                return {
                    id,
                    name,
                    url: `${absoluteApiPath}/events/files?dataElementUid=${key}&eventUid=${eventId}`,
                };
            }
            return {};
        });

    return (await Promise.all(promises))
        .reduce((acc, { id, name, url }) => {
            if (id) {
                acc[id] = { value: id, name, url };
            }
            return acc;
        }, {});
};

const getImageSubvalue = (keys: Object, querySingleResource: QuerySingleResource, eventId: string, absoluteApiPath: string) => (
    Object.keys(keys)
        .map((key) => {
            const value = keys[key];
            if (value) {
                return {
                    value,
                    ...(featureAvailable(FEATURES.trackerImageEndpoint) ?
                        {
                            url: `${absoluteApiPath}/tracker/events/${eventId}/dataValues/${key}/image`,
                            previewUrl: `${absoluteApiPath}/tracker/events/${eventId}/dataValues/${key}/image?dimension=small`,
                        } : {
                            url: `${absoluteApiPath}/events/files?dataElementUid=${key}&eventUid=${eventId}`,
                            previewUrl: `${absoluteApiPath}/events/files?dataElementUid=${key}&eventUid=${eventId}&dimension=SMALL`,
                        }
                    ),
                };
            }
            return {};
        }).reduce((acc, { value, url, previewUrl }) => {
            if (value) {
                acc[value] = { value, url, previewUrl };
            }
            return acc;
        }, {})
);

const getOrganisationUnitSubvalue = async (keys: Object, querySingleResource: QuerySingleResource) => {
    const ids = Object.values(keys)
        .join(',');

    const { organisationUnits = [] } = await querySingleResource({
        resource: 'organisationUnits',
        params: { filter: `id:in:[${ids}]` },
    });

    return organisationUnits
        .reduce((acc, { id, displayName: name }) => {
            acc[id] = { id, name };
            return acc;
        }, {});
};

const subValueGetterByElementType = {
    [dataElementTypes.FILE_RESOURCE]: getFileResourceSubvalue,
    [dataElementTypes.IMAGE]: getImageSubvalue,
    [dataElementTypes.ORGANISATION_UNIT]: getOrganisationUnitSubvalue,
};


export async function getSubValues(item: Object, querySingleResource: QuerySingleResource, absoluteApiPath: string) {
    const { type, ids: values, eventId } = item;

    if (!values) {
        return null;
    }
    return Object.keys(values).reduce(async (accValuesPromise, metaElementId) => {
        const accValues = await accValuesPromise;

        if (type) {
            // $FlowFixMe dataElementTypes flow error
            const subValueGetter = subValueGetterByElementType[type];
            if (subValueGetter) {
                const subValue = await subValueGetter(values, querySingleResource, eventId, absoluteApiPath);
                accValues[metaElementId] = subValue[values[metaElementId]];
            } else {
                accValues[metaElementId] = values[metaElementId];
            }
        }
        return accValues;
    }, Promise.resolve(values));
}
