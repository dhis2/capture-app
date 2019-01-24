// @flow
import log from 'loglevel';
import { config } from 'd2/lib/d2';
import isDefined from 'd2-utilizr/src/isDefined';
import errorCreator from '../utils/errorCreator';
import { getApi } from '../d2/d2Instance';
import RenderFoundation from '../metaData/RenderFoundation/RenderFoundation';
import elementTypeKeys from '../metaData/DataElement/elementTypes';
import { DataElement } from '../metaData';

const GET_SUBVALUE_ERROR = 'Could not get subvalue';

const subValueGetterByElementType = {
    /* [elementTypeKeys.FILE_RESOURCE]: (value: any, teiId: string, metaElementId: string) => {
        const baseUrl = config.baseUrl;
        return getApi().get(`fileResources/${value}`)
            .then(res =>
                ({
                    name: res.name,
                    value: res.id,
                    url: `${baseUrl}/trackedEntityInstances/files?dataElementUid=${metaElementId}&eventUid=${eventId}`,
                }))
            .catch((error) => {
                log.warn(errorCreator(GET_SUBVALUE_ERROR)({ value, eventId, metaElementId, error }));
                return null;
            });
    }, */
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
        // $FlowSuppress
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
