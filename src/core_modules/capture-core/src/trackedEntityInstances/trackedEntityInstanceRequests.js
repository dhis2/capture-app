// @flow

import log from 'loglevel';
import { getApi } from '../d2/d2Instance';
import RenderFoundation from '../metaData/RenderFoundation/RenderFoundation';
import { convertValue } from '../converters/serverToClient';


const errorMessages = {
    PROGRAM_NOT_FOUND: 'Program not found',
    TRACKED_ENTITY_TYPE_NOT_FOUND: 'Tracked entity type not found',
};

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

function convertToClientTei(apiTei: ApiTrackedEntityInstance, foundation: RenderFoundation) {
    const attributeValuesById = getValuesById(apiTei.attributes);
    const convertedAttributeValues = foundation.convertValues(attributeValuesById, convertValue);

    return {
        id: apiTei.trackedEntityInstance,
        tei: apiTei,
        values: convertedAttributeValues,
    };
}

export async function getTrackedEntityInstances(queryParams: ?Object, foundation: RenderFoundation) {
    const api = getApi();
    const apiRes = await api
        .get('trackedEntityInstances', { ...queryParams, totalPages: true });

    const trackedEntityInstanceContainers = apiRes && apiRes.trackedEntityInstances ? await apiRes.trackedEntityInstances.reduce(async (accTeiPromise, apiTei) => {
        const accTeis = await accTeiPromise;
        const teiContainer = convertToClientTei(apiTei, foundation);
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
