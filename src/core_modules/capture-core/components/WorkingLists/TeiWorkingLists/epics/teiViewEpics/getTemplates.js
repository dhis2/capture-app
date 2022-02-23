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
            fields: 'id,displayName,sortOrder,entityQueryCriteria,access',
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
            criteria: {
                order: 'regDate:desc',
            },
        };
        return {
            templates: [
                defaultTemplate,
                ...apiTEIFilters.map(
                    ({
                        displayName,
                        sortOrder,
                        id,
                        access,
                        entityQueryCriteria: {
                            enrollmentStatus,
                            enrollmentCreatedDate,
                            enrollmentIncidentDate,
                            order,
                            attributeValueFilters,
                            displayColumnOrder,
                            assignedUserMode,
                            assignedUsers,
                        },
                    }) => ({
                        id,
                        name: displayName,
                        order: sortOrder,
                        criteria: {
                            programStatus: enrollmentStatus,
                            enrolledAt: enrollmentCreatedDate,
                            occurredAt: enrollmentIncidentDate,
                            order,
                            displayColumnOrder,
                            assignedUserMode,
                            assignedUsers,
                            attributeValueFilters,
                        },
                        access,
                    }),
                ),
            ],
            defaultTemplateId: defaultTemplate.id,
        };
    });
