// @flow
import convertToClientEventWorkingListConfig from './convertToClientEventWorkingListConfig';
import { getEventProgramThrowIfNotFound } from '../metaData';
import { getApi } from '../d2/d2Instance';
import convertToServerEventWorkingListConfig from './convertToServerEventWorkingListConfig';


const tempServerWorkingListConfigs = [
    {
        id: 'lfsdk',
        name: 'Active events',
        eventQueryCriteria: {
            status: 'ACTIVE',
            eventDate: {
                type: 'RELATIVEPERIOD',
                data: {
                    period: 'LAST_WEEK',
                },
            },
            filters: [
                {
                    elementId: 'qrur9Dvnyt5',
                    filter: {
                        ge: 1,
                        le: 2,
                    },
                },
            ],
        },
    },
];

export const getEventProgramWorkingListConfigs = async (programId: string) => {
    const api = getApi();
    const program = getEventProgramThrowIfNotFound(programId);
    const stage = program.getStageThrowIfNull();

    const apiRes = await api.get('eventFilters', { program: programId });
    return apiRes ? apiRes.map(wc => convertToClientEventWorkingListConfig(wc, stage.stageForm)) : [];
};

export const addEventProgramWorkingListConfig = async (workingListConfigData: any) => {
    const api = getApi();
    const program = getEventProgramThrowIfNotFound(workingListConfigData.programId);
    const stage = program.getStageThrowIfNull();
    const serverData = convertToServerEventWorkingListConfig(workingListConfigData, stage.stageForm);

    const apiRes = await api.post('eventFilters', serverData);
    return apiRes;
};
