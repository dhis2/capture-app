// @flow
import type { QuerySingleResource } from 'capture-core/utils/api';
import { dataElementTypes } from '../../metaData';

const getImageOrFileResourceSubvalue = async (key: string, querySingleResource: QuerySingleResource) => {
    const { displayName: name } = await querySingleResource({ resource: 'fileResources', id: key });
    return name;
};

const getOrganisationUnitSubvalue = async (key: string, querySingleResource: QuerySingleResource) => {
    const { organisationUnits = [] } = await querySingleResource({
        resource: 'organisationUnits', params: { filter: `id:in:[${key}]` },
    });
    return { id: organisationUnits[0].id, name: organisationUnits[0].displayName };
};

export const subValueGetterByElementType = {
    [dataElementTypes.FILE_RESOURCE]: getImageOrFileResourceSubvalue,
    [dataElementTypes.IMAGE]: getImageOrFileResourceSubvalue,
    [dataElementTypes.ORGANISATION_UNIT]: getOrganisationUnitSubvalue,
};
