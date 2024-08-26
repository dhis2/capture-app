// @flow
import { dataElementTypes } from '../../../metaData';
import type { QuerySingleResource } from '../../../utils/api';
import { featureAvailable, FEATURES } from '../../../../capture-core-utils';

type SubValueFunctionProps = {
    dataElement: Object,
    querySingleResource: QuerySingleResource,
    eventId: string,
    absoluteApiPath: string,
}

const getFileResourceSubvalue = async ({ dataElement, querySingleResource, eventId, absoluteApiPath }: SubValueFunctionProps) => {
    const { value } = dataElement;
    if (!value) return null;

    const { id, displayName: name } = await querySingleResource({ resource: `fileResources/${value}` });
    return {
        id,
        name,
        url: `${absoluteApiPath}/events/files?dataElementUid=${dataElement.id}&eventUid=${eventId}`,
    };
};

const getImageSubvalue = async ({ dataElement, querySingleResource, eventId, absoluteApiPath }: SubValueFunctionProps) => {
    const { id: dataElementId, value } = dataElement;
    if (!value) return null;

    const { id, displayName: name } = await querySingleResource({ resource: `fileResources/${value}` });
    return {
        id,
        name,
        ...(featureAvailable(FEATURES.trackerImageEndpoint) ?
            {
                url: `${absoluteApiPath}/tracker/events/${eventId}/dataValues/${dataElementId}/image`,
                previewUrl: `${absoluteApiPath}/tracker/events/${eventId}/dataValues/${dataElementId}/image?dimension=small`,
            } : {
                url: `${absoluteApiPath}/events/files?dataElementUid=${dataElementId}&eventUid=${eventId}`,
                previewUrl: `${absoluteApiPath}/events/files?dataElementUid=${dataElementId}&eventUid=${eventId}`,
            }
        ),
    };
};

const getOrganisationUnitSubvalue = async ({ dataElement, querySingleResource }: SubValueFunctionProps) => {
    const organisationUnit = await querySingleResource({
        resource: 'organisationUnits',
        id: dataElement.value,
        params: {
            fields: 'id,name',
        },
    });
    return { ...organisationUnit };
};

export const subValueGetterByElementType = {
    [dataElementTypes.FILE_RESOURCE]: getFileResourceSubvalue,
    [dataElementTypes.IMAGE]: getImageSubvalue,
    [dataElementTypes.ORGANISATION_UNIT]: getOrganisationUnitSubvalue,
};
