// @flow
import {
    getTrackedEntityTypeThrowIfNotFound,
    getTrackerProgramThrowIfNotFound,
} from '../../metaData';
import type {
    SearchGroup,
} from '../../metaData';


export function getSearchGroups(trackedEntityTypeId: string, programId: ?string): Array<SearchGroup> {
    if (programId) {
        const program = getTrackerProgramThrowIfNotFound(programId);
        return program.searchGroups;
    }
    const trackedEntityType = getTrackedEntityTypeThrowIfNotFound(trackedEntityTypeId);
    return trackedEntityType.searchGroups;
}

