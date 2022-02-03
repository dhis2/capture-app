// @flow
import type { QuerySingleResource } from 'capture-core/utils/api';
import type { TeiWorkingListsTemplates } from '../../types';

type ApiConfig = {
    trackedEntityInstanceFilters: Array<Object>,
    pager: Object,
};

const getApiTEIFilters = async (programId: string, querySingleResource: QuerySingleResource) => {
    const apiRes: ApiConfig = await querySingleResource({
        resource: 'trackedEntityInstanceFilters',
        params: {
            filter: `program.id:eq:${programId}`,
            fields: 'id,displayName,enrollmentStatus,enrollmentCreatedPeriod,attributeValueFilters,sortOrder,access',
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
                ...apiTEIFilters.map(
                    ({ displayName, sortOrder, enrollmentStatus, enrollmentCreatedPeriod, id, access, attributeValueFilters }) => ({
                        id,
                        name: displayName,
                        order: sortOrder,
                        criteria: {
                            programStatus: enrollmentStatus,
                            enrollmentDate: enrollmentCreatedPeriod,
                            attributeValueFilters,
                        },
                        access,
                    }),
                ),
            ],
            defaultTemplateId: defaultTemplate.id,
        };
    });
