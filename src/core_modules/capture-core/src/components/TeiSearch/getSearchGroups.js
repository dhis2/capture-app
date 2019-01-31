// @flow
import errorCreator from '../../utils/errorCreator';
import { trackedEntityTypesCollection, programCollection } from '../../metaDataMemoryStores';
import { SearchGroup } from '../../metaData';


export default function getSearchGroups(trackedEntityTypeId: string, programId: ?string): Array<SearchGroup> {
    if (programId) {
        const program = programCollection.get(programId);
        if (!program) {
            throw new Error(errorCreator('programId not found')({ method: 'getSearchGroups' }));
        }
        // $FlowFixMe
        return program.searchGroups;
    }
    const trackedEntityType = trackedEntityTypesCollection.get(trackedEntityTypeId);
    if (!trackedEntityType) {
        throw new Error(errorCreator('trackedEntityTypeId not found')({ method: 'getSearchGroups' }));
    }
    return trackedEntityType.searchGroups;
}

