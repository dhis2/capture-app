// @flow
import type { QuerySingleResource } from 'capture-core/utils/api';
import { dataElementTypes } from '../../../../metaData';

const getImageOrFileResourceSubvalue = async (key: string, querySingleResource: QuerySingleResource) => {
    const { id, displayName: name } = await querySingleResource({ resource: 'fileResources', id: key });
    return {
        id,
        name,
    };
};

const getOrganisationUnitSubvalue = async (key: string, querySingleResource: QuerySingleResource) => {
    const organisationUnit = await querySingleResource({
        resource: 'organisationUnits',
        id: key,
        params: {
            fields: 'id,name',
        },
    });
    return { ...organisationUnit };
};

export const subValueGetterByElementType = {
    [dataElementTypes.FILE_RESOURCE]: getImageOrFileResourceSubvalue,
    [dataElementTypes.IMAGE]: getImageOrFileResourceSubvalue,
    [dataElementTypes.ORGANISATION_UNIT]: getOrganisationUnitSubvalue,
};
