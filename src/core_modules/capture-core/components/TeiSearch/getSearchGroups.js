// @flow
import {
  SearchGroup,
  getTrackedEntityTypeThrowIfNotFound,
  getTrackerProgramThrowIfNotFound,
} from '../../metaData';

export default function getSearchGroups(
  trackedEntityTypeId: string,
  programId: ?string,
): Array<SearchGroup> {
  if (programId) {
    const program = getTrackerProgramThrowIfNotFound(programId);
    return program.searchGroups;
  }
  const trackedEntityType = getTrackedEntityTypeThrowIfNotFound(trackedEntityTypeId);
  return trackedEntityType.searchGroups;
}
