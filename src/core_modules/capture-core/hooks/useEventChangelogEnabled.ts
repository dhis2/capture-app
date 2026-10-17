import { FEATURES, useFeature } from 'capture-core-utils/featuresSupport';
import { useProgramFromIndexedDB } from '../utils/cachedDataHooks/useProgramFromIndexedDB';

export const useEventChangelogEnabled = (programId: string) => {
    const enableChangeLogSupported = useFeature(FEATURES.enableChangeLog);
    const { program, isLoading } = useProgramFromIndexedDB(
        programId,
        { enabled: !!programId && enableChangeLogSupported },
    );

    if (!enableChangeLogSupported) {
        return { changelogEnabled: true, isLoading: false };
    }
    return { changelogEnabled: Boolean(program?.enableChangeLog), isLoading };
};
