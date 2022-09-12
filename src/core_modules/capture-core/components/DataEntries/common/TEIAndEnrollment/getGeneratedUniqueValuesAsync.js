// @flow
import log from 'loglevel';
import { errorCreator, pipe } from 'capture-core-utils';
import moment from 'moment';
import { convertServerToClient, convertClientToForm } from '../../../../converters';
import type { RenderFoundation } from '../../../../metaData';
import type { QuerySingleResource } from '../../../../utils/api/api.types';

type StaticPatternValues = {
    orgUnitCode: string,
};

type CacheItem = {
    value: any,
    expires: number,
};

function getExpiryTimeStamp() {
    const expiryMoment = moment().add(3, 'days');
    return expiryMoment.unix();
}

function getFormValue(value: any, type: string) {
    return pipe(convertServerToClient, convertClientToForm)(value, type);
}

async function generateUniqueValueAsync(
    teaId: string,
    staticPatternValues: StaticPatternValues,
    querySingleResource: QuerySingleResource,
) {
    const requiredValues = await querySingleResource({
        resource: `trackedEntityAttributes/${teaId}/requiredValues`,
    })
        .then(response => response && response.REQUIRED)
        .catch((error) => {
            log.error(
                errorCreator('Could not retrieve required values')({ teaId, error }),
            );
            return null;
        });

    const orgUnitCodeQueryParameter = requiredValues && requiredValues.includes('ORG_UNIT_CODE') ? {
        ORG_UNIT_CODE: staticPatternValues.orgUnitCode,
    } : null;

    const queryParameters = {
        ...orgUnitCodeQueryParameter,
        expiration: '3',
    };

    const generatedValue = await querySingleResource({
        resource: `trackedEntityAttributes/${teaId}/generate`,
        params: queryParameters,
    })
        .then(response => response && response.value)
        .catch((error) => {
            log.error(
                errorCreator('Could not generate unique id')({ teaId, error }),
            );
            return null;
        });

    return generatedValue;
}

function getActiveUniqueItemFromCache(
    id: string,
    generatedUniqueValuesCache: {[id: string]: CacheItem},
) {
    const cacheItem = generatedUniqueValuesCache[id];
    if (!cacheItem) {
        return null;
    }

    const requiredTimeStamp = moment().add(1, 'days').unix();
    return (cacheItem.expires > requiredTimeStamp) ? cacheItem : null;
}

export function getGeneratedUniqueValuesAsync(
    foundation: ?RenderFoundation,
    generatedUniqueValuesCache: Object,
    staticPatternValues: StaticPatternValues,
    querySingleResource: QuerySingleResource,
) {
    if (!foundation) {
        return Promise.resolve([]);
    }

    const itemContainerPromises = foundation
        .getElements()
        .filter(dataElement => dataElement.unique && dataElement.unique.generatable)
        .map(async (dataElement) => {
            const id = dataElement.id;
            const cacheItem = getActiveUniqueItemFromCache(id, generatedUniqueValuesCache);
            if (cacheItem) {
                return {
                    id,
                    item: cacheItem,
                };
            }
            return generateUniqueValueAsync(id, staticPatternValues, querySingleResource)
                .then(value => ({
                    id,
                    item: {
                        value: getFormValue(value, dataElement.type),
                        expires: getExpiryTimeStamp(),
                    },
                }));
        });

    return Promise
        .all(itemContainerPromises);
}

export const getUniqueValuesForAttributesWithoutValue = async (
    foundation: ?RenderFoundation,
    attributes: Object,
    staticPatternValues: StaticPatternValues,
    querySingleResource: QuerySingleResource,
) => {
    if (!foundation) {
        return {};
    }
    const uniqueDataElements = foundation.getElements().filter(dataElement => dataElement.unique && dataElement.unique.generatable);

    if (uniqueDataElements && uniqueDataElements.length > 0) {
        const uniqueDataElementsWithoutValue = uniqueDataElements.reduce((acc, dataElement) => {
            const matchedApiAttribute = attributes.find(attribute => attribute.attribute === dataElement.id);
            if (matchedApiAttribute) {
                if (matchedApiAttribute.unique && !matchedApiAttribute.value) {
                    acc = [...acc, dataElement];
                }
            } else {
                acc = [...acc, dataElement];
            }
            return acc;
        }, []);

        let uniqueValues = {};
        for (const dataElement of uniqueDataElementsWithoutValue) {
            const id = dataElement.id;
            const cacheItem = getActiveUniqueItemFromCache(id, {});
            if (cacheItem) {
                uniqueValues = { ...uniqueValues, ...{ [id]: cacheItem.value } };
            } else {
                // eslint-disable-next-line no-await-in-loop
                const generateUniqueValue = await generateUniqueValueAsync(
                    id,
                    staticPatternValues,
                    querySingleResource,
                ).then(value => ({
                    [id]: value,
                }));
                uniqueValues = { ...uniqueValues, ...generateUniqueValue };
            }
        }
        return uniqueValues;
    }
    return {};
};
