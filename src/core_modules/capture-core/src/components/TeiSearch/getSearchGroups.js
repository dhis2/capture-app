// @flow
import errorCreator from '../../utils/errorCreator';
import ProgramCollection from '../../metaDataMemoryStores/programCollection/programCollection';
import SearchGroup from '../../metaData/SearchGroup/SearchGroup';

export const getSearchGroupsByProgram = (programId: string): Array<SearchGroup> => {
    const program = ProgramCollection.get(programId);
    if (!program) {
        throw new Error(errorCreator('programId not found')({ method: 'getSearchGroupsByProgram' }));
    }
    // $FlowFixMe
    return program.searchGroups;
};

export const getSearchGroupsByTrackedEntityType = (trackedEntityTypeId: string): Array<SearchGroup> => {
    throw new Error('not implemented');
};

