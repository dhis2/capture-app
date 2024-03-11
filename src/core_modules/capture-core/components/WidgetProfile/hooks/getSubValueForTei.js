// @flow
import type { QuerySingleResource } from 'capture-core/utils/api';
import { dataElementTypes } from '../../../metaData';

type Attribute = {
    id: string,
    value: string,
    teiId: string,
    programId: string,
    absoluteApiPath: string,
};

const getFileResourceSubvalue = async (attribute: Attribute, querySingleResource: QuerySingleResource) => {
    if (!attribute.value) return null;

    const { id, displayName: name } = await querySingleResource({ resource: 'fileResources', id: attribute.value });
    return {
        id,
        name,
        value: id,
    };
};

const getImageResourceSubvalue = async (attribute: Attribute, querySingleResource: QuerySingleResource) => {
    const { id, value, teiId, programId, absoluteApiPath } = attribute;
    if (!value) return null;

    const { displayName } = await querySingleResource({ resource: 'fileResources', id: value });
    return {
        name: displayName,
        value,
        url: `${absoluteApiPath}/tracker/trackedEntities/${teiId}/attributes/${id}/image?program=${programId}`,
        previewUrl: `${absoluteApiPath}/tracker/trackedEntities/${teiId}/attributes/${id}/image?program=${programId}&dimension=small`,
    };
};

const getOrganisationUnitSubvalue = async (attribute: Attribute, querySingleResource: QuerySingleResource) => {
    const organisationUnit = await querySingleResource({
        resource: 'organisationUnits',
        id: attribute.value,
        params: {
            fields: 'id,name',
        },
    });
    return { ...organisationUnit };
};

export const subValueGetterByElementType = {
    [dataElementTypes.FILE_RESOURCE]: getFileResourceSubvalue,
    [dataElementTypes.IMAGE]: getImageResourceSubvalue,
    [dataElementTypes.ORGANISATION_UNIT]: getOrganisationUnitSubvalue,
};
