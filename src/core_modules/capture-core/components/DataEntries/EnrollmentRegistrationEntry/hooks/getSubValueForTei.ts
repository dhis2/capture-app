import type { QuerySingleResource } from '../../../../utils/api/api.types';
import { dataElementTypes } from '../../../../metaData';
import { getOrgUnitNames } from '../../../../metadataRetrieval/orgUnitName';


const getImageOrFileResourceSubvalue = async (key: string, querySingleResource: QuerySingleResource) => {
    const { id, displayName: name } = await querySingleResource({ resource: 'fileResources', id: key });
    return {
        value: id,
        name,
    };
};

const getOrganisationUnitSubvalue = async (key: string, querySingleResource: QuerySingleResource) => {
    const organisationUnit = await getOrgUnitNames([key], querySingleResource);
    return organisationUnit[key];
};

export const subValueGetterByElementType = {
    [dataElementTypes.FILE_RESOURCE]: getImageOrFileResourceSubvalue,
    [dataElementTypes.IMAGE]: getImageOrFileResourceSubvalue,
    [dataElementTypes.ORGANISATION_UNIT]: getOrganisationUnitSubvalue,
};
