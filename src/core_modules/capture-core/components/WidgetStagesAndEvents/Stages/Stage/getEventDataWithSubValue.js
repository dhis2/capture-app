// @flow
import { getApi } from 'capture-core/d2';
import type { apiDataElement } from 'capture-core/metaDataStoreLoaders/programs/quickStoreOperations/types';
import { dataElementTypes } from '../../../../metaData';

export const getQueryOrgUnit = async (orgUnitId: string) => {
    const org = await getApi().get(`organisationUnits/${orgUnitId}?fields=displayName`);
    return { name: org.displayName };
};


export const getEventDataWithSubValue = (dataElement: apiDataElement, value: any) => {
    let subValue;
    const { valueType } = dataElement;
    switch (valueType) {
    case dataElementTypes.ORGANISATION_UNIT:
        subValue = getQueryOrgUnit(value);
        break;
    case dataElementTypes.FILE_RESOURCE:
        subValue = '';
        break;
    case dataElementTypes.IMAGE:
        subValue = '';
        break;
    default: break;
    }
    return subValue;
};
