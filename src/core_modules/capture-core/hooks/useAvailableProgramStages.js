// @flow
import { useMemo } from 'react';
import log from 'loglevel';
import { useCommonEnrollmentDomainData } from '../components/Pages/common/EnrollmentOverviewDomain';
import { errorCreator } from '../../capture-core-utils';
import type { ProgramStage } from '../metaData';
import { useProgramFromIndexedDB } from '../utils/cachedDataHooks/useProgramFromIndexedDB';

export const useAvailableProgramStages = (programStage: ProgramStage, teiId: string, enrollmentId: string, programId: string) => {
    const { error: enrollmentsError, enrollment } = useCommonEnrollmentDomainData(teiId, enrollmentId, programId);
    const {
        loading: programLoading,
        error: programError,
        program,
    } = useProgramFromIndexedDB(programId);

    if (enrollmentsError || programError) {
        log.error(errorCreator('Widget Event Edit could not be loaded')({
            enrollmentsError,
            programError,
        }));
    }
    const availableProgramStages = useMemo(() => programStage.allowGenerateNextVisit
    && !programLoading && program?.programStages
        ?.reduce((accStage, currentStage) => {
            const eventCount = enrollment?.events
                ?.filter(event => event.programStage === currentStage.id)
                ?.length;
            const isAvailableStage = currentStage.repeatable || eventCount === 0;
            accStage.push({ id: currentStage.id, isAvailableStage, eventCount, currentStage });

            return accStage;
        }, []), [
        enrollment?.events,
        program?.programStages, programLoading,
        programStage.allowGenerateNextVisit,
    ]);

    return availableProgramStages ? availableProgramStages.filter(stage => stage.isAvailableStage) : [];
};
