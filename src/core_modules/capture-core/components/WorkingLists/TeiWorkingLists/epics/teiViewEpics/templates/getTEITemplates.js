// @flow
import type { QuerySingleResource } from 'capture-core/utils/api';
import type { TeiWorkingListsTemplates } from '../../../types';
import { TEI_WORKING_LISTS } from '../../../constants';
import { getDefaultTemplate } from '../../../helpers';

type ApiConfig = {
    trackedEntityInstanceFilters: Array<Object>,
    pager: Object,
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
): Promise<{ templates: TeiWorkingListsTemplates, defaultTemplateId: string, id: string, }> =>
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
                        externalAccess,
                        publicAccess,
                        user,
                        userAccesses,
                        userGroupAccesses,
                    }) => ({
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
                        externalAccess,
                        publicAccess,
                        user,
                        userAccesses,
                        userGroupAccesses,
                    }),
                ),
            ],
            defaultTemplateId: defaultTemplate.id,
            id: TEI_WORKING_LISTS,
        };
    });
