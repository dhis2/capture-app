// @flow
import { createSelector } from 'reselect';
import {
    getEventProgramThrowIfNotFound,
} from '../../../../metaData';

const programIdSelector = state => state.currentSelections.programId;

export const makeRelationshipTypesSelector = () => createSelector(
    programIdSelector,
    (programId: string) => {
        const program = getEventProgramThrowIfNotFound(programId);

        return program.getStageThrowIfNull().relationshipTypesWhereStageIsFrom;
    },
);
