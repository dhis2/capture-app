// @flow
import { useMemo, useEffect } from 'react';
// $FlowFixMe
import { useSelector, useDispatch } from 'react-redux';
import { useDataQuery } from '@dhis2/app-runtime';
import { setCommonEnrollmentSiteData } from './enrollment.actions';

export const useCommonEnrollmentDomainData = (teiId: string, enrollmentId: string, programId: string) => {
    const dispatch = useDispatch();

    const {
        enrollmentId: storedEnrollmentId,
        enrollment: storedEnrollment,
        attributeValues: storedAttributeValues,
    } = useSelector(({ enrollmentDomain }) => enrollmentDomain);

    const { data, error, refetch } = useDataQuery(
        useMemo(
            () => ({
                trackedEntityInstance: {
                    resource: 'trackedEntityInstances',
                    id: teiId,
                    params: {
                        program: programId,
                        fields: ['enrollments[*],attributes'],
                    },
                },
            }),
            [teiId, programId],
        ),
        { lazy: true },
    );

    useEffect(() => {
        if (storedEnrollmentId !== enrollmentId) {
            refetch();
        }
    }, [refetch, storedEnrollmentId, enrollmentId]);

    const fetchedEnrollmentData = {
        reference: data,
        enrollment: data?.trackedEntityInstance?.enrollments
        ?.find(enrollment => enrollment.enrollment === enrollmentId),
        attributeValues: data?.trackedEntityInstance?.attributes,
    };

    useEffect(() => {
        if (fetchedEnrollmentData.reference) {
            dispatch(setCommonEnrollmentSiteData(
                fetchedEnrollmentData.enrollment,
                fetchedEnrollmentData.attributeValues
                    .map(({ attribute, value }) => ({ id: attribute, value })),
            ));
        }
    }, [
        dispatch,
        fetchedEnrollmentData.reference,
        fetchedEnrollmentData.enrollment,
        fetchedEnrollmentData.attributeValues,
    ]);

    const inEffectData = enrollmentId === storedEnrollmentId ? {
        enrollment: storedEnrollment,
        attributeValues: storedAttributeValues,
    } : { enrollment: undefined, attributeValues: undefined };

    return {
        error,
        ...inEffectData,
    };
};
