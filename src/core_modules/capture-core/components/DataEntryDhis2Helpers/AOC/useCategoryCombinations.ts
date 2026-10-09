// DHIS2-22219: delete this file once event-side AOC reads from `program.categoryCombination`.
import { useProgramFromIndexedDB } from '../../../utils/cachedDataHooks/useProgramFromIndexedDB';

export const useCategoryCombinations = (programId: string, disabled = false) => {
    const {
        program,
        isLoading,
    } = useProgramFromIndexedDB(programId, { enabled: !disabled });
    const programCategory = !isLoading && !program?.categoryCombo?.isDefault ? program?.categoryCombo : undefined;

    return { isLoading, programCategory };
};
