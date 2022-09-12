// @flow
import log from 'loglevel';
import isDefined from 'd2-utilizr/lib/isDefined';
import { errorCreator } from 'capture-core-utils';
import { getApi } from '../d2/d2Instance';
import { type DataElement, dataElementTypes } from '../metaData';

const GET_SUBVALUE_ERROR = 'Could not get subvalue';

const subValueGetterByElementType = {
    [dataElementTypes.IMAGE]: (value: any, teiId: string, attributeId: string, absoluteApiPath: string) =>
        getApi().get(`fileResources/${value}`)
            .then(res =>
                ({
                    name: res.name,
                    value: res.id,
                    url: `${absoluteApiPath}/trackedEntityInstances/${teiId}/${attributeId}/image`,
                }))
            .catch((error) => {
                log.warn(errorCreator(GET_SUBVALUE_ERROR)({ value, teiId, attributeId, error }));
                return null;
            }) };


export async function getSubValues(
    teiId: string,
    attributes: Array<DataElement>,
    values?: ?Object,
    absoluteApiPath: string,
) {
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
                const subValue = await subValueGetter(value, teiId, attributeId, absoluteApiPath);
                accValues[attributeId] = subValue;
            }
        }
        return accValues;
    }, Promise.resolve(values));
}
