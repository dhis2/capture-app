// @flow
import { serverToClientExpiryPeriod } from '../converters/serverToClientExpiryPeriod';
import { useAuthorities } from '../utils/authority/useAuthorities';
import { useProgramFromIndexedDB } from '../utils/cachedDataHooks/useProgramFromIndexedDB';

export const useProgramExpiry = (programId: string) => {
    const { hasAuthority } = useAuthorities({ authorities: ['F_EDIT_EXPIRED'] });
    const { program } = useProgramFromIndexedDB(programId, { enabled: !!programId });

    const expiryPeriod = !hasAuthority ? {
        expiryPeriodType: serverToClientExpiryPeriod(program?.expiryPeriodType),
        expiryDays: program?.expiryDays,
    } : {
        expiryPeriodType: undefined,
        expiryDays: 0,
    };

    return expiryPeriod;
};
