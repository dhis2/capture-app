import { featureAvailable, FEATURES } from 'capture-core-utils';
import { dataElementTypes } from '../../../metaData';
import type { QuerySingleResource } from '../../../utils/api';
import { getOrgUnitNames } from '../../../metadataRetrieval/orgUnitName';

type SubValueFunctionProps = {
    dataElement: {
        id: string;
        value: any;
    };
    querySingleResource: QuerySingleResource;
    eventId: string;
    absoluteApiPath: string;
};

const getFileResourceSubvalue = async ({ dataElement, querySingleResource, eventId, absoluteApiPath }: SubValueFunctionProps) => {
    const { value } = dataElement;
    if (!value) return null;

    const { id, displayName: name } = await querySingleResource({ resource: `fileResources/${value}` });
    return {
        id,
        name,
        url: featureAvailable(FEATURES.trackerFileEndpoint)
            ? `${absoluteApiPath}/tracker/events/${eventId}/dataValues/${dataElement.id}/file`
            : `${absoluteApiPath}/events/files?dataElementUid=${dataElement.id}&eventUid=${eventId}`,
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

const getOrganisationUnitSubvalue = async ({ dataElement: { value }, querySingleResource }: SubValueFunctionProps) => {
    const organisationUnits = await getOrgUnitNames([value], querySingleResource);
    return organisationUnits[value];
};

export const subValueGetterByElementType: Record<string, (props: SubValueFunctionProps) => Promise<any>> = {
    [dataElementTypes.FILE_RESOURCE]: getFileResourceSubvalue,
    [dataElementTypes.IMAGE]: getImageSubvalue,
    [dataElementTypes.ORGANISATION_UNIT]: getOrganisationUnitSubvalue,
};
