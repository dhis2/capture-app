// @flow
import log from 'loglevel';
import { config } from 'd2';
import isDefined from 'd2-utilizr/lib/isDefined';
import { errorCreator } from 'capture-core-utils';
import { getApi } from '../d2/d2Instance';
import elementTypeKeys from '../metaData/DataElement/elementTypes';
import { DataElement } from '../metaData';

const GET_SUBVALUE_ERROR = 'Could not get subvalue';

const subValueGetterByElementType = {
    // $FlowFixMe[prop-missing] automated comment
    [elementTypeKeys.IMAGE]: (value: any, teiId: string, attributeId: string) => {
        const baseUrl = config.baseUrl;
        return getApi().get(`fileResources/${value}`)
            .then(res =>
                ({
                    name: res.name,
                    value: res.id,
                    url: `${baseUrl}/trackedEntityInstances/${teiId}/${attributeId}/image`,
                }))
            .catch((error) => {
                log.warn(errorCreator(GET_SUBVALUE_ERROR)({ value, teiId, attributeId, error }));
                return null;
            });
    },
};


export async function getSubValues(teiId: string, attributes: Array<DataElement>, values?: ?Object) {
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
                const subValue = await subValueGetter(value, teiId, attributeId);
                accValues[attributeId] = subValue;
            }
        }
        return accValues;
    }, Promise.resolve(values));
}
