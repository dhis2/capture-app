// @flow
import { useMemo } from 'react';
import { getProgramAndStageForProgram } from '../../../../metaData';
import { useProgramFromIndexedDB } from '../../../../utils/cachedDataHooks/useProgramFromIndexedDB';

export const useBuildFirstStageRegistration = (programId: string, skip: boolean = false) => {
    const { program, isLoading } = useProgramFromIndexedDB(programId, { enabled: !skip });

    const firstStage = useMemo(() => {
        if (!isLoading && program?.useFirstStageDuringRegistration) {
            const { programStages } = program;
            const programStagesWithAccess = programStages
                .filter((stage) => {
                    const access = {
                        read: stage.access.data.read,
                        write: stage.access.data.write,
                    };
                    return access.write;
                })
                .sort((a, b) => a.sortOrder - b.sortOrder);
            return programStagesWithAccess[0]?.id;
        }
        return null;
    }, [program, isLoading]);

    const firstStageMetaData = useMemo(
        () => (firstStage && programId ? getProgramAndStageForProgram(programId, firstStage) : null),
        [firstStage, programId],
    );

    return { loading: isLoading, firstStageMetaData };
};
