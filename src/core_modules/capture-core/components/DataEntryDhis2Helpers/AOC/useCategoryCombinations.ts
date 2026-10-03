import { useProgramFromIndexedDB } from '../../../utils/cachedDataHooks/useProgramFromIndexedDB';

export const useCategoryCombinations = (programId: string, disabled = false) => {
    const {
        program,
        isLoading,
    } = useProgramFromIndexedDB(programId, { enabled: !disabled });
    const programCategory = !isLoading && !program?.categoryCombo?.isDefault ? program?.categoryCombo : undefined;

    return { isLoading, programCategory };
};

export const useEnrollmentCategoryCombinations = (programId: string, disabled = false) => {
    const {
        program,
        isLoading,
    } = useProgramFromIndexedDB(programId, { enabled: !disabled });
    const enrollmentProgramCategory = !isLoading && !program?.enrollmentCategoryCombo?.isDefault
        ? program?.enrollmentCategoryCombo
        : undefined;

    return { isLoading, enrollmentProgramCategory };
};
