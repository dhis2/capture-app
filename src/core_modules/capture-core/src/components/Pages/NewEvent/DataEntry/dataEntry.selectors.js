// @flow
import { createSelector } from 'reselect';
import programCollection from '../../../../metaDataMemoryStores/programCollection/programCollection';

const programIdSelector = state => state.currentSelections.programId;

export const makeProgramNameSelector = () => createSelector(
    programIdSelector,
    (programId: string) => {
        const program = programCollection.get(programId);
        const programName = (program && program.name) || '';
        return programName;
    },
);
