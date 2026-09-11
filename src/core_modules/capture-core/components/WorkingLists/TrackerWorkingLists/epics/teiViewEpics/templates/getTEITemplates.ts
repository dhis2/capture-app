import type { QuerySingleResource } from 'capture-core/utils/api';
import type { TrackerWorkingListsTemplates } from '../../../types';
import { TRACKER_WORKING_LISTS } from '../../../constants';
import { getDefaultTemplate } from '../../../helpers';

type ApiConfig = {
    trackedEntityInstanceFilters: Array<any>,
    pager: any,
};

const getApiTEIFilters = async (programId: string, querySingleResource: QuerySingleResource) => {
    const apiRes: ApiConfig = await querySingleResource({
        resource: 'trackedEntityInstanceFilters',
        params: {
            filter: `program.id:eq:${programId}`,
            fields: 'id,displayName,sortOrder,entityQueryCriteria,access,sharing',
        },
    });
    return apiRes && apiRes.trackedEntityInstanceFilters ? apiRes.trackedEntityInstanceFilters : [];
};

export const getTEITemplates = (
    programId: string,
    querySingleResource: QuerySingleResource,
): Promise<{ templates: TrackerWorkingListsTemplates, defaultTemplateId: string, id: string, }> =>
    getApiTEIFilters(programId, querySingleResource).then((apiTEIFilters) => {
        const defaultTemplate = getDefaultTemplate(programId);

        return {
            templates: [
                defaultTemplate,
                ...apiTEIFilters.map(
                    ({
                        displayName,
                        sortOrder,
                        id,
                        access,
                        sharing,
                        entityQueryCriteria: {
                            enrollmentStatus,
                            enrollmentCreatedDate,
                            enrollmentIncidentDate,
                            order,
                            attributeValueFilters,
                            followUp,
                            displayColumnOrder,
                            assignedUserMode,
                            assignedUsers,
                        } = {},
                    }: any) => ({
                        id,
                        name: displayName,
                        order: sortOrder,
                        criteria: {
                            programStatus: enrollmentStatus,
                            enrolledAt: enrollmentCreatedDate,
                            occurredAt: enrollmentIncidentDate,
                            followUp,
                            order,
                            displayColumnOrder,
                            assignedUserMode,
                            assignedUsers,
                            attributeValueFilters,
                        },
                        access,
                        sharing,
                    }),
                ),
            ],
            defaultTemplateId: defaultTemplate.id,
            id: TRACKER_WORKING_LISTS,
        };
    });
