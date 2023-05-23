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
        isLoading: programLoading,
        isError: programError,
        program,
    } = useProgramFromIndexedDB(programId);

    if (enrollmentsError || programError) {
        log.error(errorCreator('Widget Event Edit could not be loaded')({
            enrollmentsError,
            programError,
        }));
    }
    const availableProgramStages = useMemo(
        () =>
            programStage.allowGenerateNextVisit &&
            !programLoading &&
            program?.programStages?.map((currentStage) => {
                const eventCount = enrollment?.events
                    ?.filter(event => event.programStage === currentStage.id)
                    ?.length;
                const isAvailableStage = currentStage.repeatable ||
                    (programStage.id !== currentStage.id && eventCount === 0);

                return { id: currentStage.id, isAvailableStage, eventCount, currentStage };
            }),
        [
            enrollment?.events,
            program?.programStages,
            programLoading,
            programStage.allowGenerateNextVisit,
            programStage.id,
        ],
    );

    return availableProgramStages ? availableProgramStages.filter(stage => stage.isAvailableStage) : [];
};
