// @flow
import { getApiEventFilters } from '../helpers/eventFilters';

export const getTemplatesAsync = (state: ReduxState) => {
    const programId = state.currentSelections.programId;
    return getApiEventFilters(programId).then((workingListConfigs) => {
        const defaultWorkingListConfig = {
            id: `${programId}-default`,
            isDefault: true,
            name: 'default',
            displayName: 'default',
        };
        const workingListConfigsWithDefault = [defaultWorkingListConfig, ...workingListConfigs];
        return { workingListConfigs: workingListConfigsWithDefault, default: defaultWorkingListConfig };
    });
};
