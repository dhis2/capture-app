// @flow
import log from 'loglevel';
import isDefined from 'd2-utilizr/lib/isDefined';
import { errorCreator, featureAvailable, FEATURES } from 'capture-core-utils';
import { type DataElement, dataElementTypes } from '../metaData';
import type { QuerySingleResource } from '../utils/api/api.types';

const GET_SUBVALUE_ERROR = 'Could not get subvalue';

const subValueGetterByElementType = {
    [dataElementTypes.IMAGE]: ({
        value,
        teiId,
        attributeId,
        absoluteApiPath,
        querySingleResource,
        programId,
    }: {
        value: any,
        teiId: string,
        attributeId: string,
        absoluteApiPath: string,
        querySingleResource: QuerySingleResource,
        programId: ?string,
    }) =>
        querySingleResource({ resource: `fileResources/${value}` })
            .then((res) => {
                const buildUrl = () => {
                    if (featureAvailable(FEATURES.trackerImageEndpoint)) {
                        if (programId) {
                            return `${absoluteApiPath}/tracker/trackedEntities/${teiId}/attributes/${attributeId}/image?program=${programId}&dimension=small`;
                        }
                        return `${absoluteApiPath}/tracker/trackedEntities/${teiId}/attributes/${attributeId}/image?dimension=small`;
                    }
                    return `${absoluteApiPath}/trackedEntityInstances/${teiId}/${attributeId}/image`;
                };
                const previewUrl = buildUrl();

                return {
                    name: res.name,
                    value: res.id,
                    previewUrl,
                    url: previewUrl,
                };
            })
            .catch((error) => {
                log.warn(errorCreator(GET_SUBVALUE_ERROR)({ value, teiId, attributeId, error }));
                return null;
            }) };


export async function getSubValues({
    teiId,
    attributes,
    values,
    absoluteApiPath,
    querySingleResource,
    programId,
}: {
    teiId: string,
    attributes: Array<DataElement>,
    values?: ?Object,
    absoluteApiPath: string,
    querySingleResource: QuerySingleResource,
    programId: ?string,
}) {
    if (!values) {
        return null;
    }
    // $FlowFixMe
    const attributesById = attributes.toHashMap('id');

    return Object.keys(values).reduce(async (accValuesPromise, attributeId) => {
        const accValues = await accValuesPromise;

        const value = values[attributeId];
        const metaElement = attributesById[attributeId];
        if (isDefined(value) && metaElement) {
            const subValueGetter = subValueGetterByElementType[metaElement.type];
            if (subValueGetter) {
                const subValue = await subValueGetter({
                    value,
                    teiId,
                    attributeId,
                    absoluteApiPath,
                    querySingleResource,
                    programId,
                });
                accValues[attributeId] = subValue;
            }
        }
        return accValues;
    }, Promise.resolve(values));
}
