// @flow
import { getEventFilters } from './eventFiltersInterface';

export const getTemplatesAsync = (state: ReduxState) => {
    const programId = state.currentSelections.programId;
    return getEventFilters(programId).then((workingListConfigs) => {
        const defaultWorkingListConfig = {
            id: `${programId}-default`,
            isDefault: true,
            name: 'default',
        };
        const workingListConfigsWithDefault = [defaultWorkingListConfig, ...workingListConfigs];
        return { workingListConfigs: workingListConfigsWithDefault, default: defaultWorkingListConfig };
    });
};
