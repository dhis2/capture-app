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
            fields: 'id,displayName,programStage,sortOrder,programStageQueryCriteria,access,sharing',
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
                    ({
                        displayName,
                        id,
                        access,
                        sharing,
                        programStage: { id: programStage },
                        programStageQueryCriteria: {
                            enrollmentStatus,
                            enrolledAt,
                            enrollmentOccurredAt,
                            eventStatus,
                            eventScheduledAt,
                            eventOccurredAt,
                            followUp,
                            order,
                            attributeValueFilters,
                            dataFilters,
                            displayColumnOrder,
                            assignedUserMode,
                            assignedUsers,
                        } = {},
                    }: any) => ({
                        id,
                        name: displayName,
                        criteria: {
                            programStatus: enrollmentStatus,
                            enrolledAt,
                            occurredAt: enrollmentOccurredAt,
                            programStage,
                            eventOccurredAt,
                            followUp,
                            status: eventStatus,
                            scheduledAt: eventScheduledAt,
                            dataFilters,
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
            id: PROGRAM_STAGE_WORKING_LISTS,
        };
    });
