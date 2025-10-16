import { useMemo } from 'react';
import { useApiDataQuery } from '../../../utils/reactQueryHelpers';
import { convertValue } from '../../../converters/serverToClient';
import { dataElementTypes } from '../../../metaData';

type Props = {
    enrollmentId?: string;
};

type EnrollmentDatesForPlugin = {
    enrolledAt: string;
    occurredAt: string;
} | undefined;

type ReturnType = {
    enrollmentDates: EnrollmentDatesForPlugin;
    isLoading: boolean;
    isError: boolean;
};

export const useEnrollmentDatesForPlugin = ({ enrollmentId }: Props): ReturnType => {
    const query = useMemo(() => ({
        resource: 'tracker/enrollments',
        id: enrollmentId,
        params: {
            fields: 'enrolledAt,occurredAt',
        },
    }), [enrollmentId]);

    const { data, isLoading, isError } = useApiDataQuery<any>(
        ['enrollmentDatesForPlugin', enrollmentId],
        enrollmentId ? query : undefined,
        {
            enabled: !!enrollmentId,
            select: (response: any) => {
                if (!response) return undefined;

                const enrolledAt = response.enrolledAt
                    ? convertValue(response.enrolledAt, dataElementTypes.DATE)
                    : '';
                const occurredAt = response.occurredAt
                    ? convertValue(response.occurredAt, dataElementTypes.DATE)
                    : '';

                return {
                    enrolledAt,
                    occurredAt,
                };
            },
        },
    );

    return {
        enrollmentDates: data,
        isLoading,
        isError,
    };
};
