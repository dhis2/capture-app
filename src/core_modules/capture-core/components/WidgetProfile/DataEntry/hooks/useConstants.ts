import { useMemo } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';

const fields = 'id,displayName,value';

type ConstantsResponse = {
    constants: {
        constants: any[];
    };
};

export const useConstants = () => {
    const { error, loading, data } = useDataQuery<ConstantsResponse>(
        useMemo(
            () => ({
                constants: {
                    resource: 'constants',
                    params: {
                        fields,
                    },
                },
            }),
            [],
        ),
    );

    return {
        error,
        constants: !loading && data?.constants?.constants,
    };
};
