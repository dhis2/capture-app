// @flow
import React, { useMemo, type ComponentType } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';

type Props = {
    enrollmentId: string,
};

export const withEnrollment = (Component: ComponentType) => (props: Props) => {
    const enrollmentQuery = useMemo(
        () => ({
            enrollment: {
                resource: `enrollments/${props.enrollmentId}`,
            },
        }),
        [props.enrollmentId],
    );

    const enrollmentFetch = useDataQuery(enrollmentQuery);

    if (enrollmentFetch.error) {
        throw enrollmentFetch.error;
    }

    return enrollmentFetch.data && enrollmentFetch.data.enrollment ? (
        <Component {...props} enrollment={enrollmentFetch.data.enrollment} />
    ) : (
        <> </>
    );
};
