import { createSelector } from 'reselect';
import {
    getEventProgramThrowIfNotFound,
} from '../../../../metaData';

const programIdSelector = (state: any) => state.currentSelections.programId;

export const makeRelationshipTypesSelector = () => createSelector(
    programIdSelector,
    (programId: string) => {
        const program = getEventProgramThrowIfNotFound(programId);
        return program.stage.relationshipTypesWhereStageIsFrom.filter(
            (rt: any) => rt.to.entity === 'TRACKED_ENTITY_INSTANCE'
        );
    },
);
