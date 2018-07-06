// @flow
import isDefined from 'd2-utilizr/src/isDefined';
import { getApi } from '../d2/d2Instance';
import RenderFoundation from '../metaData/RenderFoundation/RenderFoundation';
import elementTypeKeys from '../metaData/DataElement/elementTypes';

const subValueGetterByElementType = {
    [elementTypeKeys.FILE_RESOURCE]: (value: any) =>
        getApi().get(`fileResources/${value}`).then(res => ({ name: res.name, value: res.id })),
};


export async function getSubValues(programStage: RenderFoundation, values: Object) {
    const elementsById = programStage.getElementsById();

    return Object.keys(values).reduce(async (accValuesPromise, key) => {
        const accValues = await accValuesPromise;
        const value = values[key];
        const metaElement = elementsById[key];
        if (isDefined(value) && metaElement) {
            const subValueGetter = subValueGetterByElementType[metaElement.type];
            if (subValueGetter) {
                const subValue = await subValueGetter(value);
                accValues[key] = subValue;
            }
        }
        return accValues;
    }, Promise.resolve(values));
}
