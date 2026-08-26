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

const getFileResourceSubvalue = async ({
    dataElement, querySingleResource, eventId, absoluteApiPath,
}: SubValueFunctionProps) => {
    const { value } = dataElement;
    if (!value) return null;

    const { id, displayName: name } = await querySingleResource({ resource: `fileResources/${value}` });
    return {
        id,
        name,
        url: `${absoluteApiPath}/tracker/events/${eventId}/dataValues/${dataElement.id}/file`,
    };
};

const getImageSubvalue = async ({ dataElement, querySingleResource, eventId, absoluteApiPath }: SubValueFunctionProps) => {
    const { id: dataElementId, value } = dataElement;
    if (!value) return null;

    const { id, displayName: name } = await querySingleResource({ resource: `fileResources/${value}` });
    return {
        id,
        name,
        url: `${absoluteApiPath}/tracker/events/${eventId}/dataValues/${dataElementId}/image`,
        previewUrl: `${absoluteApiPath}/tracker/events/${eventId}/dataValues/${dataElementId}/image?dimension=small`,
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
