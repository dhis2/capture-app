// @flow
import { serverToClientExpiryPeriod } from '../converters/serverToClientExpiryPeriod';
import { useApiMetadataQuery } from '../utils/reactQueryHelpers';

export const useProgramExpiry = (programId: string) => {
    const { data, isLoading } = useApiMetadataQuery(
        ['programProtectionLevel', programId],
        {
            resource: 'programs',
            id: programId,
            params: { fields: 'expiryPeriodType,expiryDays' },
        },
        { enabled: !!programId },
    );

    return {
        expiryPeriodType: serverToClientExpiryPeriod(data?.expiryPeriodType),
        expiryDays: data?.expiryDays,
        expiryValuesLoading: isLoading,
    };
};
