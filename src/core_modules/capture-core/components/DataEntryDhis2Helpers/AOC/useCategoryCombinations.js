// @flow
import { useProgramFromIndexedDB } from '../../../utils/cachedDataHooks/useProgramFromIndexedDB';

export const useCategoryCombinations = (programId: string, disabled: boolean = false) => {
    const {
        program,
        isLoading,
    } = useProgramFromIndexedDB(programId, { enabled: !disabled });
    const programCategory = !isLoading && !program?.categoryCombo?.isDefault ? program?.categoryCombo : undefined;

    return { isLoading, programCategory };
};
