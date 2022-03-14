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
    trackedEntity: string,
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

    await getSubValues(apiTei.trackedEntity, attributes, convertedAttributeValues);

    return {
        id: apiTei.trackedEntity,
        tei: apiTei,
        values: convertedAttributeValues,
    };
}

type TrackedEntityInstancesPromise = Promise<{|
    trackedEntityInstanceContainers: any,
    pagingData: any
|}>

export async function getTrackedEntityInstances(queryParams: Object, attributes: Array<DataElments>): TrackedEntityInstancesPromise {
    const api = getApi();
    const apiRes = await api
        .get('tracker/trackedEntities', queryParams);

    const trackedEntityInstanceContainers = apiRes && apiRes.instances ? await apiRes.instances.reduce(async (accTeiPromise, apiTei) => {
        const accTeis = await accTeiPromise;
        const teiContainer = await convertToClientTei(apiTei, attributes);
        if (teiContainer) {
            accTeis.push(teiContainer);
        }
        return accTeis;
    }, Promise.resolve([])) : null;

    const pagingData = {
        rowsPerPage: queryParams.pageSize,
        currentPage: queryParams.page,
    };

    return {
        trackedEntityInstanceContainers,
        pagingData,
    };
}
