// @flow
import { useMemo, useEffect } from 'react';
// $FlowFixMe
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { useDataQuery } from '@dhis2/app-runtime';
import { setEnrollment } from '../../EnrollmentPage.actions';

export const useEnrollment = (teiId: string) => {
    const dispatch = useDispatch();
    const { enrollmentId } = useSelector(
        ({
            router: {
                location: { query },
            },
        }) => ({ enrollmentId: query.enrollmentId }),
        shallowEqual,
    );
    const enrollmentStored = useSelector(
        ({ enrollmentSite }) => ({ enrollmentSite }),
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
        { lazy: true },
    );

    const fechedEnrollment =
        !loading &&
        data?.trackedEntityInstance?.enrollments.find(
            enrollment => enrollment.enrollment === enrollmentId,
        );

    // no enrollment data exists in the Redux store or the enrollment id from the Redux store doesn't match the enrollment id from the url.
    const shouldFetchAndSave =
        !enrollmentStored || enrollmentStored.enrollment !== enrollmentId;

    useEffect(() => {
        if (shouldFetchAndSave) {
            if (!called) {
                refetch();
            } else {
                fechedEnrollment && dispatch(setEnrollment(fechedEnrollment));
            }
        }
    }, [shouldFetchAndSave, fechedEnrollment, called, refetch, dispatch]);

    return {
        error,
        enrollment: enrollmentStored,
    };
};
