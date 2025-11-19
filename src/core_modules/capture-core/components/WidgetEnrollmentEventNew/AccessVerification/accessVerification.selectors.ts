import { createSelector } from 'reselect';
import { getProgramEventAccess } from '../../../metaData';

const programIdSelector = (state: any, { programId }: any) => programId;
const programStageIdSelector = (state: any, { stageId }: any) => stageId;

export const makeEventAccessSelector = () => createSelector(
    programIdSelector,
    programStageIdSelector,
    (programId: string, programStageId: string | null) =>
        programId && getProgramEventAccess(programId, programStageId));
