// @flow

import { getApi } from '../d2/d2Instance';
import { convertDataElementsValues } from '../metaData';
import { convertValue } from '../converters/serverToClient';
import { getSubValues } from './getSubValues';

type ApiTeiAttribute = {
    attribute: any,
    value: any
};

type ApiTrackedEntityInstance = {
    trackedEntityInstance: string,
    trackedEntityType: string,
    orgUnit: string,
    attributes: Array<ApiTeiAttribute>
};

function getValuesById(apiAttributeValues: Array<ApiTeiAttribute>) {
    if (!apiAttributeValues) {
        return apiAttributeValues;
    }

    return apiAttributeValues.reduce((accValues, attrValue) => {
        accValues[attrValue.attribute] = attrValue.value;
        return accValues;
    }, {});
}

// $FlowFixMe[cannot-resolve-name] automated comment
async function convertToClientTei(apiTei: ApiTrackedEntityInstance, attributes: Array<DataElments>) {
    const attributeValuesById = getValuesById(apiTei.attributes);
    const convertedAttributeValues = convertDataElementsValues(attributeValuesById, attributes, convertValue);

    await getSubValues(apiTei.trackedEntityInstance, attributes, convertedAttributeValues);

    return {
        id: apiTei.trackedEntityInstance,
        tei: apiTei,
        values: convertedAttributeValues,
    };
}

export async function getTrackedEntityInstances(queryParams: ?Object, attributes: Array<DataElments>) {
    const api = getApi();
    const apiRes = await api
        .get('trackedEntityInstances', { ...queryParams, totalPages: true });

    const trackedEntityInstanceContainers = apiRes && apiRes.trackedEntityInstances ? await apiRes.trackedEntityInstances.reduce(async (accTeiPromise, apiTei) => {
        const accTeis = await accTeiPromise;
        const teiContainer = await convertToClientTei(apiTei, attributes);
        if (teiContainer) {
            accTeis.push(teiContainer);
        }
        return accTeis;
    }, Promise.resolve([])) : null;

    const pagingData = {
        rowsCount: apiRes.pager.total,
        rowsPerPage: apiRes.pager.pageSize,
        currentPage: apiRes.pager.page,
    };
    return {
        trackedEntityInstanceContainers,
        pagingData,
    };
}
