// @flow
import { scopeTypes } from '../metaData';
import { useScopeInfo } from './useScopeInfo';

export const useTitleText = (selectedSearchScopeId: ?string) => {
    const { trackedEntityName, programName, scopeType } = useScopeInfo(selectedSearchScopeId);

    const text = {
        [scopeTypes.EVENT_PROGRAM]: `${programName}`,
        [scopeTypes.TRACKER_PROGRAM]: `${trackedEntityName} in program: ${programName}`,
        [scopeTypes.TRACKED_ENTITY_TYPE]: `${trackedEntityName}`,
    };

    return scopeType ? text[scopeType] : '';
};
