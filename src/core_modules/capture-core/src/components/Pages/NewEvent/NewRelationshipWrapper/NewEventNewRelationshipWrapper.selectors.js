// @flow
import { createSelector } from 'reselect';
import log from 'loglevel';
import errorCreator from '../../../../utils/errorCreator';
import {
    getEventProgramThrowIfNotFound,
} from '../../../../metaData';
import programCollection from '../../../../metaDataMemoryStores/programCollection/programCollection';

const programIdSelector = state => state.currentSelections.programId;

export const makeRelationshipTypesSelector = () => createSelector(
    programIdSelector,
    (programId: string) => {
        const program = getEventProgramThrowIfNotFound(programId);

        return program.getStageThrowIfNull().relationshipTypes;
    },
);
