// @flow
import { useMemo } from 'react';
import { getProgramFromProgramIdThrowIfNotFound, TrackerProgram } from '../../metaData';
import { programTypes } from './programTypes.const';

export const useProgram = (programId: string) => useMemo(() => {
    const program = getProgramFromProgramIdThrowIfNotFound(programId);
    return {
        program,
        programType: program instanceof TrackerProgram ? programTypes.TRACKER_PROGRAM : programTypes.EVENT_PROGRAM,
    };
}, [programId]);
