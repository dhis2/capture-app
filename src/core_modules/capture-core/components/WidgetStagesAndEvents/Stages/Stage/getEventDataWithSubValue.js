// @flow
import { getApi } from 'capture-core/d2';
import { dataElementTypes } from '../../../../metaData';


const getImageOrFileResourceSubvalue = async (keys: Array<string>) => {
    const promises = keys
        .map(async (key) => {
            const { id, displayName: name } = await getApi().get(`fileResources/${key}`);
            return {
                id,
                name,
            };
        });

    return (await Promise.all(promises))
        .reduce((acc, { id, name }) => {
            acc[id] = name;
            return acc;
        }, {});
};


const getOrganisationUnitSubvalue = async (keys: Array<string>) => {
    const ids = Object.values(keys)
        .join(',');

    const { organisationUnits = [] } = await getApi().get(`organisationUnits?filter=id:in:[${ids}]`);

    return organisationUnits
        .reduce((acc, { id, displayName: name }) => {
            acc[id] = { id, name };
            return acc;
        }, {});
};

const subValueGetterByElementType = {
    [dataElementTypes.FILE_RESOURCE]: getImageOrFileResourceSubvalue,
    [dataElementTypes.IMAGE]: getImageOrFileResourceSubvalue,
    [dataElementTypes.ORGANISATION_UNIT]: getOrganisationUnitSubvalue,
};


export async function getSubValues(eventId: string, type: any, values?: ?Object) {
    if (!values) {
        return null;
    }
    return Object.keys(values).reduce(async (accValuesPromise, metaElementId) => {
        const accValues = await accValuesPromise;

        if (type) {
            // $FlowFixMe dataElementTypes flow error
            const subValueGetter = subValueGetterByElementType[type];
            if (subValueGetter) {
                const subValue = await subValueGetter(values);
                accValues[metaElementId] = subValue[values[metaElementId]];
            } else {
                accValues[metaElementId] = values[metaElementId];
            }
        }
        return accValues;
    }, Promise.resolve(values));
}
