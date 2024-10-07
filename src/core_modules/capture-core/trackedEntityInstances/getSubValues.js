// @flow
import isDefined from 'd2-utilizr/lib/isDefined';
import log from 'loglevel';
import { featureAvailable, FEATURES, errorCreator } from 'capture-core-utils';
import { type DataElement, dataElementTypes } from '../metaData';
import type { QuerySingleResource } from '../utils/api/api.types';

const subValueGetterByElementType = {
    [dataElementTypes.IMAGE]: ({
        teiId,
        attributeId,
        absoluteApiPath,
        programId,
    }: {
        teiId: string,
        attributeId: string,
        absoluteApiPath: string,
        programId: ?string,
    }) => {
        const url = featureAvailable(FEATURES.trackerImageEndpoint)
            ? `${absoluteApiPath}/tracker/trackedEntities/${teiId}/attributes/${attributeId}/image?dimension=small`
            : `${absoluteApiPath}/trackedEntityInstances/${teiId}/${attributeId}/image?dimension=SMALL`;
        const previewUrl = programId ? `${url}&program=${programId}` : url;

        return {
            previewUrl,
            url: previewUrl,
        };
    },
    [dataElementTypes.FILE_RESOURCE]: ({
        value,
        teiId,
        attributeId,
        absoluteApiPath,
        querySingleResource,
        programId,
    }: {
        value: string,
        teiId: string,
        attributeId: string,
        absoluteApiPath: string,
        querySingleResource: QuerySingleResource,
        programId: ?string,
    }) =>
        querySingleResource({ resource: `fileResources/${value}` })
            .then((res) => {
                const fileUrl = featureAvailable(FEATURES.trackerFileEndpoint)
                    ? `${absoluteApiPath}/tracker/trackedEntities/${teiId}/attributes/${attributeId}/file`
                    : `${absoluteApiPath}/trackedEntityInstances/${teiId}/${attributeId}/file`;
                const url = programId ? `${fileUrl}?program=${programId}` : fileUrl;

                return {
                    name: res.name,
                    url,
                };
            })
            .catch((error) => {
                log.warn(errorCreator('Could not get subvalue')({ value, teiId, attributeId, error }));
                return null;
            }),
};

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
