// @flow
import isDefined from 'd2-utilizr/src/isDefined';
import { getApi } from '../d2/d2Instance';
import { config } from 'd2/lib/d2';
import RenderFoundation from '../metaData/RenderFoundation/RenderFoundation';
import elementTypeKeys from '../metaData/DataElement/elementTypes';

const subValueGetterByElementType = {
    [elementTypeKeys.FILE_RESOURCE]: (value: any, eventId: string, metaElementId: string) => {
        const baseUrl = config.baseUrl;
        return getApi().get(`fileResources/${value}`)
            .then(res =>
                ({
                    name: res.name,
                    value: res.id,
                    url: `${baseUrl}/events/files?dataElementUid=${metaElementId}&eventUid=${eventId}`,
                }));
    },
    [elementTypeKeys.IMAGE]: (value: any, eventId: string, metaElementId: string) => {
        const baseUrl = config.baseUrl;
        return getApi().get(`fileResources/${value}`)
            .then(res =>
                ({
                    name: res.name,
                    value: res.id,
                    url: `${baseUrl}/events/files?dataElementUid=${metaElementId}&eventUid=${eventId}`,
                }));
    },
};


export async function getSubValues(eventId: string, programStage: RenderFoundation, values?: ?Object) {
    if (!values) {
        return null;
    }

    const elementsById = programStage.getElementsById();

    return Object.keys(values).reduce(async (accValuesPromise, metaElementId) => {
        const accValues = await accValuesPromise;
        const value = values[metaElementId];
        const metaElement = elementsById[metaElementId];
        if (isDefined(value) && metaElement) {
            const subValueGetter = subValueGetterByElementType[metaElement.type];
            if (subValueGetter) {
                const subValue = await subValueGetter(value, eventId, metaElementId);
                accValues[metaElementId] = subValue;
            }
        }
        return accValues;
    }, Promise.resolve(values));
}
