// @flow
import React, { useMemo, type ComponentType } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';

type Props = {
    programId: string,
};

export const withProgram = (Component: ComponentType) => (props: Props) => {
    const programQuery = useMemo(
        () => ({
            programs: {
                resource: `programs/${props.programId}`,
                params: {
                    fields: ['displayIncidentDate,incidentDateLabel,enrollmentDateLabel'],
                },
            },
        }),
        [props.programId],
    );

    const programFetch = useDataQuery(programQuery);

    if (programFetch.error) {
        throw programFetch.error;
    }

    return programFetch.data && programFetch.data.programs ? (
        <Component {...props} program={programFetch.data.programs} />
    ) : (
        <> </>
    );
};
