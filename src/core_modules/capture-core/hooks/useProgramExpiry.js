// @flow
import { serverToClientExpiryPeriod } from '../converters/serverToClientExpiryPeriod';
import { useProgramFromIndexedDB } from '../utils/cachedDataHooks/useProgramFromIndexedDB';

export const useProgramExpiry = (programId: string) => {
    const { program, isLoading } = useProgramFromIndexedDB(programId, { enabled: !!programId });

    return {
        expiryPeriodType: serverToClientExpiryPeriod(program?.expiryPeriodType),
        expiryDays: program?.expiryDays,
        expiryValuesLoading: isLoading,
    };
};
