import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCommonEnrollmentSiteData } from '../enrollment.actions';
import type { Output } from './useCommonEnrollmentDomainData.types';
import { useApiDataQuery } from '../../../../../utils/reactQueryHelpers';

export const useCommonEnrollmentDomainData = (teiId: string, enrollmentId: string, programId: string): Output => {
    const dispatch = useDispatch();

    const {
        enrollmentId: storedEnrollmentId,
        enrollment: storedEnrollment,
        attributeValues: storedAttributeValues,
    } = useSelector(({ enrollmentDomain }: any) => enrollmentDomain);

    const awaitInitialFetch = useRef(!!(teiId && programId && enrollmentId));

    const { data, error } = useApiDataQuery(
        ['stages&event', 'enrollmentData', teiId, programId, enrollmentId],
        {
            resource: 'tracker/trackedEntities',
            id: teiId,
            params: {
                program: programId,
                fields: ['enrollments[*,!attributes],attributes'],
            },
        },
        {
            enabled: !!(teiId && programId && enrollmentId),
            staleTime: 0,
            cacheTime: 0,
        },
    ) as any;

    const fetchedEnrollmentData = {
        reference: data,
        enrollment: data?.enrollments
            ?.find((enrollment: any) => enrollment.enrollment === enrollmentId),
        attributeValues: data?.attributes,
    };

    useEffect(() => {
        if (fetchedEnrollmentData.reference) {
            dispatch(setCommonEnrollmentSiteData(
                fetchedEnrollmentData.enrollment,
                fetchedEnrollmentData.attributeValues
                    .map(({ attribute, value }: any) => ({ id: attribute, value })),
            ));
            awaitInitialFetch.current = false;
        }
    }, [
        dispatch,
        fetchedEnrollmentData.reference,
        fetchedEnrollmentData.enrollment,
        fetchedEnrollmentData.attributeValues,
    ]);

    const inEffectData = (enrollmentId === storedEnrollmentId) && !awaitInitialFetch.current ? {
        enrollment: storedEnrollment,
        attributeValues: storedAttributeValues,
    } : { enrollment: undefined, attributeValues: undefined };

    return {
        error,
        ...inEffectData,
    };
};
