// @flow
import convertToClientEventWorkingListConfig from './convertToClientEventWorkingListConfig';
import { getEventProgramThrowIfNotFound } from '../metaData';


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
    const program = getEventProgramThrowIfNotFound(programId);
    const stage = program.getStageThrowIfNull();

    const promise = new Promise((resolve) => { setTimeout(() => resolve(tempServerWorkingListConfigs), 1000); });

    const result = await promise;

    return result && result.map(wc => convertToClientEventWorkingListConfig(wc, stage.stageForm));
};
