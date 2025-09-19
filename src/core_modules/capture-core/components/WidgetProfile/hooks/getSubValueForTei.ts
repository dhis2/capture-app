import { dataElementTypes } from '../../../metaData';
import { FEATURES, featureAvailable } from '../../../../capture-core-utils';
import { getOrgUnitNames } from '../../../metadataRetrieval/orgUnitName';
import type { Attribute, SubValueFunctionParams } from './hooks.types';

const buildTEAFileUrl = (attribute: Attribute) => {
    const { absoluteApiPath, teiId, programId, id } = attribute;

    return featureAvailable(FEATURES.trackerFileEndpoint)
        ? `${absoluteApiPath}/tracker/trackedEntities/${teiId}/attributes/${id}/file?program=${programId}`
        : `${absoluteApiPath}/trackedEntityInstances/${teiId}/${id}/file`;
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

    const urls = featureAvailable(FEATURES.trackerImageEndpoint) ? {
        url: `${absoluteApiPath}/tracker/trackedEntities/${teiId}/attributes/${id}/image?program=${programId}`,
        previewUrl: `${absoluteApiPath}/tracker/trackedEntities/${teiId}/attributes/${id}/image?program=${programId}&dimension=small`,
    } : {
        url: `${absoluteApiPath}/trackedEntityInstances/${teiId}/${id}/image?program=${programId}`,
        previewUrl: `${absoluteApiPath}/trackedEntityInstances/${teiId}/${id}/image?program=${programId}&dimension=SMALL`,
    };

    return {
        value,
        ...urls,
    };
};

const getOrganisationUnitSubvalue = async ({ attribute: { value }, querySingleResource }: SubValueFunctionParams) => {
    const organisationUnits = await getOrgUnitNames([value], querySingleResource);
    return organisationUnits[value];
};

export const subValueGetterByElementType = {
    [dataElementTypes.FILE_RESOURCE]: getFileResourceSubvalue,
    [dataElementTypes.IMAGE]: getImageResourceSubvalue,
    [dataElementTypes.ORGANISATION_UNIT]: getOrganisationUnitSubvalue,
};
