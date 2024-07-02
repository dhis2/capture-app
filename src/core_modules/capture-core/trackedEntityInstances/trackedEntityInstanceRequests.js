// @flow
import { handleAPIResponse, REQUESTED_ENTITIES } from 'capture-core/utils/api';
import { type DataElement, convertDataElementsValues } from '../metaData';
import { convertValue } from '../converters/serverToClient';
import { getSubValues } from './getSubValues';
import type { QuerySingleResource } from '../utils/api/api.types';

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

async function convertToClientTei(
    apiTei: ApiTrackedEntityInstance,
    // $FlowFixMe[cannot-resolve-name] automated comment
    attributes: Array<DataElement>,
    absoluteApiPath: string,
    querySingleResource: QuerySingleResource,
    programId: ?string,
) {
    const attributeValuesById = getValuesById(apiTei.attributes);
    const convertedAttributeValues = convertDataElementsValues(attributeValuesById, attributes, convertValue);

    await getSubValues({
        teiId: apiTei.trackedEntity,
        attributes,
        values: convertedAttributeValues,
        absoluteApiPath,
        querySingleResource,
        programId,
    });

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

export async function getTrackedEntityInstances(
    queryParams: Object,
    attributes: Array<DataElement>,
    absoluteApiPath: string,
    querySingleResource: QuerySingleResource,
    selectedProgramId: ?string,
): TrackedEntityInstancesPromise {
    const apiResponse = await querySingleResource({
        resource: 'tracker/trackedEntities',
        params: queryParams,
    });
    const apiTrackedEntities = handleAPIResponse(REQUESTED_ENTITIES.trackedEntities, apiResponse);

    const trackedEntityInstanceContainers = await apiTrackedEntities.reduce(async (accTeiPromise, apiTei) => {
        const accTeis = await accTeiPromise;
        const teiContainer = await convertToClientTei(
            apiTei,
            attributes,
            absoluteApiPath,
            querySingleResource,
            selectedProgramId,
        );
        if (teiContainer) {
            accTeis.push(teiContainer);
        }
        return accTeis;
    }, Promise.resolve([]));

    const pagingData = {
        rowsPerPage: queryParams.pageSize,
        currentPage: queryParams.page,
    };

    return {
        trackedEntityInstanceContainers,
        pagingData,
    };
}
