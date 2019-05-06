// @flow
import {
    getEventProgramWorkingListConfigs,
} from '../../../../../eventWorkingListConfig/eventWorkingListConfigRequests';

export const getWorkingListConfigsAsync = (state: ReduxState) => {
    const programId = state.currentSelections.programId;
    return getEventProgramWorkingListConfigs(programId).then((workingListConfigs) => {
        const defaultWorkingListConfig = {
            id: `${programId}-default`,
            isDefault: true,
            name: 'default',
            sortById: 'eventDate',
            sortByDirection: 'desc',
        };
        const workingListConfigsWithDefault = [defaultWorkingListConfig, ...workingListConfigs];
        return { workingListConfigs: workingListConfigsWithDefault, default: defaultWorkingListConfig };
    });
};
