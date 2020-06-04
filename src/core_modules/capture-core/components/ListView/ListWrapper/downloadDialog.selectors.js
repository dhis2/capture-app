// @flow
import { createSelector } from 'reselect';
import { getEventProgramThrowIfNotFound } from '../../../metaData';

const getProgramId = state => state.currentSelections.programId;
// $FlowFixMe
export const makeProgramStageIdSelector = () => createSelector(
    getProgramId,
    (programId) => {
        const eventProgram = getEventProgramThrowIfNotFound(programId);
        return eventProgram.stage.id;
    }
);