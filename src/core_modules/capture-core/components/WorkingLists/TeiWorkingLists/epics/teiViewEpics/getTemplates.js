// @flow
import type { QuerySingleResource } from 'capture-core/utils/api';
import type { TeiWorkingListsTemplates } from '../../types';
import { dataElementTypes } from '../../../../../metaData';
import { convertToClientConfig } from '../../helpers/TEIFilters/apiTEIFilterToClientConfigConverter';

type ApiConfig = {
    trackedEntityInstanceFilters: Array<Object>,
    pager: Object,
};

const getApiTEIFilters = async (programId: string, querySingleResource: QuerySingleResource) => {
    const apiRes: ApiConfig = await querySingleResource({
        resource: 'trackedEntityInstanceFilters',
        params: {
            filter: `program.id:eq:${programId}`,
            fields: 'id,displayName,enrollmentStatus,enrollmentCreatedPeriod,sortOrder,access',
        },
    });
    return apiRes && apiRes.trackedEntityInstanceFilters ? apiRes.trackedEntityInstanceFilters : [];
};

export const getTemplates = (
    programId: string,
    querySingleResource: QuerySingleResource,
): Promise<{ templates: TeiWorkingListsTemplates, defaultTemplateId: string }> =>
    getApiTEIFilters(programId, querySingleResource).then((apiTEIFilters) => {
        const defaultTemplate = {
            id: `${programId}-default`,
            isDefault: true,
            name: 'default',
            access: {
                update: false,
                delete: false,
                write: false,
                manage: false,
            },
        };

        return {
            templates: [
                defaultTemplate,
                // TODO blocked by https://jira.dhis2.org/browse/DHIS2-12376. Need to get all the trackedEntityInstanceFilters fields and convert them to client
                ...apiTEIFilters.map(({ displayName, sortOrder, enrollmentStatus, enrollmentCreatedPeriod, id, access }) => ({
                    id,
                    name: displayName,
                    order: sortOrder,
                    criteria: {
                        programStatus: enrollmentStatus,
                        ...(enrollmentCreatedPeriod && { enrollmentDate: convertToClientConfig(enrollmentCreatedPeriod, dataElementTypes.DATE) }),
                    },
                    access,
                })),
            ],
            defaultTemplateId: defaultTemplate.id,
        };
    });
