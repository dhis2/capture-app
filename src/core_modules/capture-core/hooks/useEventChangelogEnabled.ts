import { FEATURES, useFeature } from 'capture-core-utils/featuresSupport';
import { useProgramFromIndexedDB } from '../utils/cachedDataHooks/useProgramFromIndexedDB';

export const useEventChangelogEnabled = (programId: string): boolean => {
    const enableChangeLogSupported = useFeature(FEATURES.enableChangeLog);
    const { program } = useProgramFromIndexedDB(programId, { enabled: !!programId && enableChangeLogSupported });

    if (!enableChangeLogSupported) return true;
    return Boolean(program?.enableChangeLog);
};
