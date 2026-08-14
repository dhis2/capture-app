import { useMemo } from 'react';
import { useAuthority } from '../utils/authority/useAuthority';
import { Authorities } from '../utils/authority/authorities';
import { useProgramFromIndexedDB } from '../utils/cachedDataHooks/useProgramFromIndexedDB';

export const useCompleteEventsExpiryForUser = (programId: string): number | undefined => {
    const { hasAuthority } = useAuthority(Authorities.EDIT_EXPIRED);
    const { program } = useProgramFromIndexedDB(programId, { enabled: !!programId });

    return useMemo(() => {
        if (hasAuthority) return undefined;
        return program?.completeEventsExpiryDays;
    }, [hasAuthority, program?.completeEventsExpiryDays]);
};
