// @flow
import { useMemo } from 'react';
// $FlowFixMe
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { useDataQuery } from '@dhis2/app-runtime';
import { saveEnrollment } from '../../EnrollmentPage.actions';

export const useEnrollment = (teiId: string) => {
    const { enrollmentId } = useSelector(
        ({
            router: {
                location: { query },
            },
        }) => ({ enrollmentId: query.enrollmentId }),
        shallowEqual,
    );
    const enrollmentStored = useSelector(
        ({ enrollmentSite }) => ({
            enrollmentSite,
        }),
        shallowEqual,
    ).enrollmentSite;
    const { data, error, loading, refetch, called } = useDataQuery(
        useMemo(
            () => ({
                trackedEntityInstance: {
                    resource: 'trackedEntityInstances',
                    id: teiId,
                    params: { fields: ['enrollments[*]'] },
                },
            }),
            [teiId],
        ),
        {
            lazy: true,
        },
    );
    const dispatch = useDispatch();
    const fechedEnrollment =
        !loading &&
        data?.trackedEntityInstance?.enrollments.find(
            enrollment => enrollment.enrollment === enrollmentId,
        );

    if (
        !called &&
        (!enrollmentStored || enrollmentStored.enrollment !== enrollmentId)
    ) {
        refetch();
    }
    if (called && fechedEnrollment && !enrollmentStored.enrollment) {
        dispatch(saveEnrollment(fechedEnrollment));
    }

    return {
        error,
        enrollment: enrollmentStored,
    };
};
