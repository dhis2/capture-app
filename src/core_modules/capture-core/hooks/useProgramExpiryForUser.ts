import { useMemo } from 'react';
import { serverToClientExpiryPeriod } from '../converters/serverToClientExpiryPeriod';
import { useAuthority } from '../utils/authority/useAuthority';
import { Authorities } from '../utils/authority/authorities';
import { useProgramFromIndexedDB } from '../utils/cachedDataHooks/useProgramFromIndexedDB';

export const useProgramExpiryForUser = (programId: string) => {
    const { hasAuthority } = useAuthority(Authorities.EDIT_EXPIRED);
    const { program } = useProgramFromIndexedDB(programId, { enabled: !!programId });

    const expiryPeriod = useMemo(() => {
        if (!hasAuthority) {
            return {
                expiryPeriodType: serverToClientExpiryPeriod(program?.expiryPeriodType),
                expiryDays: program?.expiryDays,
            };
        }

        return undefined;
    }, [hasAuthority, program?.expiryPeriodType, program?.expiryDays]);

    return expiryPeriod;
};

