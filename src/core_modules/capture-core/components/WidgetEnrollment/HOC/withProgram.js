// @flow
import React, { useMemo, type ComponentType } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';

type Props = {
    programId: string,
};

export const withProgram = (Component: ComponentType<any>) => (
    props: Props,
) => {
    const { error, loading, data } = useDataQuery(
        useMemo(
            () => ({
                programs: {
                    resource: `programs/${props.programId}`,
                    params: {
                        fields: [
                            'displayIncidentDate,incidentDateLabel,enrollmentDateLabel',
                        ],
                    },
                },
            }),
            [props.programId],
        ),
    );

    if (error) {
        throw error;
    }

    return !loading && data && data.programs ? (
        <Component {...props} program={data.programs} />
    ) : (
        <> </>
    );
};
