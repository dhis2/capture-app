// @flow
import React, { useMemo, type ComponentType } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';

type Props = {
    enrollmentId: string,
};

export const withEnrollment = (Component: ComponentType<any>) => (
    props: Props,
) => {
    const { error, loading, data } = useDataQuery(
        useMemo(
            () => ({
                enrollment: {
                    resource: `enrollments/${props.enrollmentId}`,
                },
            }),
            [props.enrollmentId],
        ),
    );

    if (error) {
        throw error;
    }

    return !loading && data?.enrollment ? (
        <Component {...props} enrollment={data.enrollment} />
    ) : (
        <> </>
    );
};
