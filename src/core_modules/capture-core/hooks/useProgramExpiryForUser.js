// @flow
import { useMemo } from 'react';
import { serverToClientExpiryPeriod } from '../converters/serverToClientExpiryPeriod';
import { useAuthorities } from '../utils/authority/useAuthorities';
import { useProgramFromIndexedDB } from '../utils/cachedDataHooks/useProgramFromIndexedDB';

export const useProgramExpiryForUser = (programId: string) => {
    const { hasAuthority } = useAuthorities({ authorities: ['F_EDIT_EXPIRED'] });
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

