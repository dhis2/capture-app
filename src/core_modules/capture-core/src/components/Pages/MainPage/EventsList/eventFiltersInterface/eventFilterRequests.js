// @flow
import { getApi } from '../../../../../d2/d2Instance';
// import convertToServerEventWorkingListConfig from './convertToServerEventWorkingListConfig';

type ApiConfig = {
    eventFilters: Array<Object>,
    pager: Object,
};

export const getEventFilters = async (programId: string) => {
    const api = getApi();
    const apiRes: ApiConfig = await api.get('eventFilters', { filter: `program:eq:${programId}`, fields: '*' });
    const configs = apiRes && apiRes.eventFilters;
    return configs;
};

/*
export const addEventFilters = async (workingListConfigData: any) => {
    const api = getApi();
    const program = getEventProgramThrowIfNotFound(workingListConfigData.programId);
    const stage = program.stage;
    const serverData = convertToServerEventWorkingListConfig(workingListConfigData, stage.stageForm);

    const apiRes = await api.post('eventFilters', serverData);
    return apiRes;
};
*/
