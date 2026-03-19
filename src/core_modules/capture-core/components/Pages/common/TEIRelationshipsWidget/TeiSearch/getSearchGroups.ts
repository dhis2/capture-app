import {
    getTrackedEntityTypeThrowIfNotFound,
    getTrackerProgramThrowIfNotFound,
} from '../../../../../metaData';
import type {
    SearchGroup,
} from '../../../../../metaData';


export function getSearchGroups(trackedEntityTypeId: string, programId: string | null | undefined): Array<SearchGroup> {
    const raw = programId
        ? getTrackerProgramThrowIfNotFound(programId).searchGroups
        : getTrackedEntityTypeThrowIfNotFound(trackedEntityTypeId).searchGroups;
    return raw.filter(sg => sg.id !== 'nonSearchable');
}
