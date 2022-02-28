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
            fields: 'id,displayName,enrollmentStatus,enrollmentCreatedPeriod,incidentDate,order,displayColumnOrder,attributeValueFilters,sortOrder,access,assignedUserMode,assignedUsers',
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
                        enrollmentStatus,
                        enrollmentCreatedPeriod,
                        id,
                        access,
                        attributeValueFilters,
                        incidentDate,
                        order,
                        displayColumnOrder,
                        assignedUserMode,
                        assignedUsers,
                    }) => ({
                        id,
                        name: displayName,
                        order: sortOrder,
                        criteria: {
                            programStatus: enrollmentStatus,
                            enrolledAt: enrollmentCreatedPeriod,
                            occurredAt: incidentDate,
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
