// @flow
import { dataElementTypes } from '../../../../metaData';
import type { QuerySingleResource } from '../../../../utils/api/api.types';

const getImageOrFileResourceSubvalue = async (keys: Array<string>, querySingleResource: QuerySingleResource) => {
    const promises = keys
        .map(async (key) => {
            const { id, displayName: name } = await querySingleResource({ resource: `fileResources/${key}` });
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


const getOrganisationUnitSubvalue = async (keys: Array<string>, querySingleResource: QuerySingleResource) => {
    const ids = Object.values(keys)
        .join(',');

    const { organisationUnits = [] } = await querySingleResource({
        resource: 'organisationUnits',
        params: { filter: `id:in:[${ids}]` },
    });

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


export async function getSubValues(type: any, values?: ?Object, querySingleResource: QuerySingleResource) {
    if (!values) {
        return null;
    }
    return Object.keys(values).reduce(async (accValuesPromise, metaElementId) => {
        const accValues = await accValuesPromise;

        if (type) {
            // $FlowFixMe dataElementTypes flow error
            const subValueGetter = subValueGetterByElementType[type];
            if (subValueGetter) {
                const subValue = await subValueGetter(values, querySingleResource);
                accValues[metaElementId] = subValue[values[metaElementId]];
            } else {
                accValues[metaElementId] = values[metaElementId];
            }
        }
        return accValues;
    }, Promise.resolve(values));
}
