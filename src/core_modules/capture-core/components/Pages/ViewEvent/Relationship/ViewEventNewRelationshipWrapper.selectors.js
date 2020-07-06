// @flow
import { createSelector } from 'reselect';
import {
    getEventProgramThrowIfNotFound,
} from '../../../../metaData';

const programIdSelector = state => state.currentSelections.programId;

// $FlowFixMe[missing-annot] automated comment
export const makeRelationshipTypesSelector = () => createSelector(
    programIdSelector,
    (programId: string) => {
        const program = getEventProgramThrowIfNotFound(programId);
        return program.stage.relationshipTypesWhereStageIsFrom.filter(rt => rt.to.entity === 'TRACKED_ENTITY_INSTANCE');
    },
);
