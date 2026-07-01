import { useMemo } from 'react';
import { useAuthorities } from '../utils/authority/useAuthorities';
import { useProgramFromIndexedDB } from '../utils/cachedDataHooks/useProgramFromIndexedDB';

export const useCompleteEventsExpiryForUser = (programId: string): number | undefined => {
    const { hasAuthority } = useAuthorities({ authorities: ['F_EDIT_EXPIRED'] });
    const { program } = useProgramFromIndexedDB(programId, { enabled: !!programId });

    return useMemo(() => {
        if (hasAuthority) return undefined;
        return program?.completeEventsExpiryDays;
    }, [hasAuthority, program?.completeEventsExpiryDays]);
};
