// @flow
import { getApi } from 'capture-core/d2';
import { dataElementTypes } from '../../metaData';

const getImageOrFileResourceSubvalue = async (key: string) => {
    const { displayName: name } = await getApi().get(`fileResources/${key}`);
    return name;
};


const getOrganisationUnitSubvalue = async (key: string) => {
    const { organisationUnits = [] } = await getApi().get(`organisationUnits?filter=id:in:[${key}]`);
    return organisationUnits[0].displayName;
};

export const subValueGetterByElementType = {
    [dataElementTypes.FILE_RESOURCE]: getImageOrFileResourceSubvalue,
    [dataElementTypes.IMAGE]: getImageOrFileResourceSubvalue,
    [dataElementTypes.ORGANISATION_UNIT]: getOrganisationUnitSubvalue,
};
