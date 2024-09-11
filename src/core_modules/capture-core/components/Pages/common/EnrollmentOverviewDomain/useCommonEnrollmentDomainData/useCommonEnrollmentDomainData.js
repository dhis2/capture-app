// @flow
import { useEffect } from 'react';
// $FlowFixMe
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
    } = useSelector(({ enrollmentDomain }) => enrollmentDomain);

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
            enabled: !!teiId && !!programId && !!enrollmentId,
            staleTime: 0,
            cacheTime: 0,
        },
    );

    const fetchedEnrollmentData = {
        reference: data,
        enrollment: data?.enrollments
            ?.find(enrollment => enrollment.enrollment === enrollmentId),
        attributeValues: data?.attributes,
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
