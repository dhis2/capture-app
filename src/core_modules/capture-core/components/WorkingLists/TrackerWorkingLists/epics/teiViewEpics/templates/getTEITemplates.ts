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
            fields: 'id,displayName,sortOrder,entityQueryCriteria,access,externalAccess,publicAccess,user,userAccesses,userGroupAccesses',
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
                    (template: any) => {
                        const displayName = template.displayName;
                        const sortOrder = template.sortOrder;
                        const id = template.id;
                        const access = template.access;
                        const criteria = template.entityQueryCriteria || {};
                        const externalAccess = template.externalAccess;
                        const publicAccess = template.publicAccess;
                        const user = template.user;
                        const userAccesses = template.userAccesses;
                        const userGroupAccesses = template.userGroupAccesses;
                        return {
                            id,
                            name: displayName,
                            order: sortOrder,
                            criteria: {
                                programStatus: criteria.enrollmentStatus,
                                enrolledAt: criteria.enrollmentCreatedDate,
                                occurredAt: criteria.enrollmentIncidentDate,
                                followUp: criteria.followUp,
                                order: criteria.order,
                                displayColumnOrder: criteria.displayColumnOrder,
                                assignedUserMode: criteria.assignedUserMode,
                                assignedUsers: criteria.assignedUsers,
                                attributeValueFilters: criteria.attributeValueFilters,
                            },
                            access,
                            externalAccess,
                            publicAccess,
                            user,
                            userAccesses,
                            userGroupAccesses,
                        };
                    })
            ],
            defaultTemplateId: defaultTemplate.id,
            id: TRACKER_WORKING_LISTS,
        };
    });
