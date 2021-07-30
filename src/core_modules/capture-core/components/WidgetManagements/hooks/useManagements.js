// @flow
import { useMemo } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';

type Props = {|
    enrollmentId: string,
    filter?: ?string,
|}

export const useManagements = ({ enrollmentId, filter = '' }: Props) => {
    const { error, loading, called, data, refetch } = useDataQuery(
        useMemo(
            () => ({
                managements: {
                    resource: `managements/${enrollmentId}`,
                    params: ({ variables: { filter: status } }) => status && ({
                        filter: `status:eq:${status}`,
                    }),
                },
            }),
            [enrollmentId],
        ), { lazy: true },
    );

    if (enrollmentId && !called) {
        refetch({ variables: { filter } });
    }

    return { error, refetch, managements: !loading && data?.managements };
};
