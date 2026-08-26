import { dataElementTypes } from '../../../metaData';
import { getOrgUnitNames } from '../../../metadataRetrieval/orgUnitName';
import type { Attribute, SubValueFunctionParams } from './hooks.types';

const buildTEAFileUrl = (attribute: Attribute) => {
    const { absoluteApiPath, teiId, programId, id } = attribute;

    return `${absoluteApiPath}/tracker/trackedEntities/${teiId}/attributes/${id}/file?program=${programId}`;
};

const getFileResourceSubvalue = async ({
    attribute,
    querySingleResource,
}: SubValueFunctionParams) => {
    if (!attribute.value) return null;

    const { id, displayName: name } = await querySingleResource({ resource: 'fileResources', id: attribute.value });
    return {
        id,
        name,
        value: id,
        url: buildTEAFileUrl(attribute),
    };
};

const getImageResourceSubvalue = async ({ attribute }: SubValueFunctionParams) => {
    const { id, value, teiId, programId, absoluteApiPath } = attribute;
    if (!value) return null;

    const urls = {
        url: `${absoluteApiPath}/tracker/trackedEntities/${teiId}/attributes/${id}/image?program=${programId}`,
        previewUrl: `${absoluteApiPath}/tracker/trackedEntities/${teiId}/attributes/${id}/image` +
            `?program=${programId}&dimension=small`,
    };

    return {
        value,
        ...urls,
    };
};

const getOrganisationUnitSubvalue = async ({ attribute: { value }, querySingleResource }: SubValueFunctionParams) => {
    if (!value) {
        return undefined;
    }
    const organisationUnits = await getOrgUnitNames([value], querySingleResource);
    return organisationUnits[value];
};

export const subValueGetterByElementType = {
    [dataElementTypes.FILE_RESOURCE]: getFileResourceSubvalue,
    [dataElementTypes.IMAGE]: getImageResourceSubvalue,
    [dataElementTypes.ORGANISATION_UNIT]: getOrganisationUnitSubvalue,
};
