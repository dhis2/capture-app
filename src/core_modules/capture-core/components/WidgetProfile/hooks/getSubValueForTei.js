// @flow
import type { QuerySingleResource } from 'capture-core/utils/api';
import { dataElementTypes } from '../../../metaData';
import { FEATURES, hasAPISupportForFeature } from '../../../../capture-core-utils';

type Attribute = {
    id: string,
    value: string,
    teiId: string,
    programId: string,
    absoluteApiPath: string,
};

type SubValueFunctionParams = {
    attribute: Attribute,
    querySingleResource: QuerySingleResource,
    minorServerVersion: number,
};

const getFileResourceSubvalue = async ({ attribute, querySingleResource }: SubValueFunctionParams) => {
    if (!attribute.value) return null;

    const { id, displayName: name } = await querySingleResource({ resource: 'fileResources', id: attribute.value });
    return {
        id,
        name,
        value: id,
    };
};

const getImageResourceSubvalue = async ({ attribute, minorServerVersion }: SubValueFunctionParams) => {
    const { id, value, teiId, programId, absoluteApiPath } = attribute;
    if (!value) return null;

    const urls = hasAPISupportForFeature(minorServerVersion, FEATURES.trackerImageEndpoint) ? {
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

const getOrganisationUnitSubvalue = async ({ attribute, querySingleResource }: SubValueFunctionParams) => {
    const organisationUnit = await querySingleResource({
        resource: 'organisationUnits',
        id: attribute.value,
        params: {
            fields: 'id,name,ancestors[displayName]',
        },
    });

    const orgUnitClientValue = {
        id: organisationUnit.id,
        name: organisationUnit.name,
        ancestors: organisationUnit.ancestors.map(ancestor => ancestor.displayName),
    };

    return orgUnitClientValue;
};

export const subValueGetterByElementType = {
    [dataElementTypes.FILE_RESOURCE]: getFileResourceSubvalue,
    [dataElementTypes.IMAGE]: getImageResourceSubvalue,
    [dataElementTypes.ORGANISATION_UNIT]: getOrganisationUnitSubvalue,
};
