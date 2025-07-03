import {
    getTrackedEntityTypeThrowIfNotFound,
    getTrackerProgramThrowIfNotFound,
} from '../../../../../metaData';


export function getSearchGroups(trackedEntityTypeId, programId) {
    if (programId) {
        const program = getTrackerProgramThrowIfNotFound(programId);
        return program.searchGroups;
    }
    const trackedEntityType = getTrackedEntityTypeThrowIfNotFound(trackedEntityTypeId);
    return trackedEntityType.searchGroups;
}

