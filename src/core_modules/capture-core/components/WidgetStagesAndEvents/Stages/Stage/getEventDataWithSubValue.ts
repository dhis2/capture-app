import { featureAvailable, FEATURES } from 'capture-core-utils';
import { dataElementTypes } from '../../../../metaData';
import type { QuerySingleResource } from '../../../../utils/api/api.types';
import { getOrgUnitNames } from '../../../../metadataRetrieval/orgUnitName';
import type { ApiEnrollmentEvent } from '../../../../../capture-core-utils/types/api-types';
import type { StageDataElement } from '../../types/common.types';

const getFileResourceSubvalue = async (keys: Record<string, unknown>, querySingleResource: QuerySingleResource, eventId: string, absoluteApiPath: string) => {
    const promises = Object.keys(keys)
        .map(async (key) => {
            const value = keys[key];
            if (value && featureAvailable(FEATURES.trackerImageEndpoint)) {
                const { name } = await querySingleResource({
                    resource: 'fileResources',
                    id: value,
                });
                return {
                    [key]: {
                        name,
                        value,
                        url: `${absoluteApiPath}/events/files?dataElementUid=${key}&eventUid=${eventId}`,
                    },
                };
            }
            return {
                [key]: {
                    name: value,
                    value,
                    url: `${absoluteApiPath}/events/files?dataElementUid=${key}&eventUid=${eventId}`,
                },
            };
        });

    const subValues = await Promise.all(promises);
    return subValues
        .reduce((acc, subValue) => {
            acc = { ...acc, ...subValue };
            return acc;
        }, {});
};

const getImageSubvalue = (keys: Record<string, unknown>, querySingleResource: QuerySingleResource, eventId: string, absoluteApiPath: string) => (
    Object.keys(keys)
        .map((key) => {
            const value = keys[key];
            if (value) {
                return {
                    [key]: {
                        name: value,
                        value,
                        url: `${absoluteApiPath}/events/files?dataElementUid=${key}&eventUid=${eventId}`,
                    },
                };
            }
            return {
                [key]: {
                    name: value,
                    value,
                },
            };
        })
        .reduce((acc, subValue) => {
            acc = { ...acc, ...subValue };
            return acc;
        }, {})
);

const getOrganisationUnitSubvalue = async (keys: Record<string, unknown>, querySingleResource: QuerySingleResource) => {
    const ids = Object.values(keys).map(value => String(value));
    const orgUnitNames = await getOrgUnitNames(ids, querySingleResource);
    return orgUnitNames;
};

export const getSubValues = async (item: { type: string; ids: Record<string, unknown>; eventId: string }, querySingleResource: QuerySingleResource, absoluteApiPath: string) => {
    const { type, ids: values, eventId } = item;

    if (!values) {
        return null;
    }

    const subValueGetters = {
        [dataElementTypes.FILE_RESOURCE]: getFileResourceSubvalue,
        [dataElementTypes.IMAGE]: getImageSubvalue,
        [dataElementTypes.ORGANISATION_UNIT]: getOrganisationUnitSubvalue,
    };

    if (type && subValueGetters[type]) {
        if (type === dataElementTypes.FILE_RESOURCE) {
            return getFileResourceSubvalue(values, querySingleResource, eventId, absoluteApiPath);
        } else if (type === dataElementTypes.IMAGE) {
            return getImageSubvalue(values, querySingleResource, eventId, absoluteApiPath);
        } else if (type === dataElementTypes.ORGANISATION_UNIT) {
            return getOrganisationUnitSubvalue(values, querySingleResource);
        }
    }

    return null;
};

export const getEventDataWithSubValue = async (event: ApiEnrollmentEvent, dataElements: Array<StageDataElement>, querySingleResource: QuerySingleResource, absoluteApiPath: string) => {
    const fileResourceKeys = {};
    const imageKeys = {};
    const orgUnitKeys = {};

    event.dataValues && event.dataValues.forEach((dataValue) => {
        const dataElement = dataElements.find(element => element.id === dataValue.dataElement);
        if (dataElement) {
            if (dataElement.type === dataElementTypes.FILE_RESOURCE) {
                fileResourceKeys[dataValue.dataElement] = dataValue.value;
            } else if (dataElement.type === dataElementTypes.IMAGE) {
                imageKeys[dataValue.dataElement] = dataValue.value;
            } else if (dataElement.type === dataElementTypes.ORGANISATION_UNIT) {
                orgUnitKeys[dataValue.dataElement] = dataValue.value;
            }
        }
    });

    const fileResourceSubValues = Object.keys(fileResourceKeys).length > 0 ?
        await getFileResourceSubvalue(fileResourceKeys, querySingleResource, event.event, absoluteApiPath) : {};

    const imageSubValues = Object.keys(imageKeys).length > 0 ?
        getImageSubvalue(imageKeys, querySingleResource, event.event, absoluteApiPath) : {};

    const orgUnitSubValues = Object.keys(orgUnitKeys).length > 0 ?
        await getOrganisationUnitSubvalue(orgUnitKeys, querySingleResource) : {};

    return {
        ...event,
        subValues: {
            ...fileResourceSubValues,
            ...imageSubValues,
            ...orgUnitSubValues,
        },
    };
};
