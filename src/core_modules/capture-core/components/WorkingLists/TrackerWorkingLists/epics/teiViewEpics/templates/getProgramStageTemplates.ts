import type { QuerySingleResource } from 'capture-core/utils/api';
import type { TrackerWorkingListsTemplates } from '../../../types';
import { PROGRAM_STAGE_WORKING_LISTS } from '../../../constants';
import { getDefaultTemplate } from '../../../helpers';

type ApiConfig = {
    programStageWorkingLists: Array<any>,
    pager: any,
};

const getApiTEIFilters = async (programId: string, querySingleResource: QuerySingleResource) => {
    const apiRes: ApiConfig = await querySingleResource({
        resource: 'programStageWorkingLists',
        params: {
            filter: `program.id:eq:${programId}`,
            fields: 'id,displayName,programStage,sortOrder,programStageQueryCriteria,access,externalAccess,publicAccess,user,userAccesses,userGroupAccesses',
        },
    });
    return apiRes && apiRes.programStageWorkingLists ? apiRes.programStageWorkingLists : [];
};

export const getProgramStageTemplates = (
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
                        const id = template.id;
                        const access = template.access;
                        const programStage = template.programStage?.id;
                        const criteria = template.programStageQueryCriteria || {};
                        const externalAccess = template.externalAccess;
                        const publicAccess = template.publicAccess;
                        const user = template.user;
                        const userAccesses = template.userAccesses;
                        const userGroupAccesses = template.userGroupAccesses;
                        return {
                            id,
                            name: displayName,
                            criteria: {
                                programStatus: criteria.enrollmentStatus,
                                enrolledAt: criteria.enrolledAt,
                                occurredAt: criteria.enrollmentOccurredAt,
                                programStage,
                                eventOccurredAt: criteria.eventOccurredAt,
                                followUp: criteria.followUp,
                                status: criteria.eventStatus,
                                scheduledAt: criteria.eventScheduledAt,
                                dataFilters: criteria.dataFilters,
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
            id: PROGRAM_STAGE_WORKING_LISTS,
        };
    });
