// @flow
import { scopeTypes } from '../metaData';
import { useScopeInfo } from './useScopeInfo';

export const useScopeTitleText = (scopeId: ?string) => {
    const { trackedEntityName, programName, scopeType } = useScopeInfo(scopeId);

    const text = {
        [scopeTypes.EVENT_PROGRAM]: `${programName}`,
        [scopeTypes.TRACKER_PROGRAM]: `${trackedEntityName} in program: ${programName}`,
        [scopeTypes.TRACKED_ENTITY_TYPE]: `${trackedEntityName}`,
    };

    return scopeType ? text[scopeType] : '';
};
