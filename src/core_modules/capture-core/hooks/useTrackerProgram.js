// @flow
import { useMemo } from 'react';
import { getTrackerProgramThrowIfNotFound } from '../metaData';

export const useTrackerProgram = (programId: string) =>
    useMemo(() => getTrackerProgramThrowIfNotFound(programId), [programId]);
