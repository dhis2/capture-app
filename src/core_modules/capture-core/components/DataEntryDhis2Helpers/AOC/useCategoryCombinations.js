// @flow
import { useProgramFromIndexedDB } from '../../../utils/cachedDataHooks/useProgramFromIndexedDB';

export const useCategoryCombinations = (programId: string, disabled = false) => {
    const {
        program,
        isLoading,
    } = useProgramFromIndexedDB(programId, { enabled: !disabled });
    const programCategory = !program?.categoryCombo?.isDefault && program?.categoryCombo;

    return { isLoading, programCategory };
};
