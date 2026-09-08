import { useEffect } from 'react';
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
        inactive: storedInactive,
        programOwnerId: storedProgramOwnerId,
    } = useSelector(({ enrollmentDomain }: any) => enrollmentDomain);

    const { data, error } = useApiDataQuery(
        ['stages&event', 'enrollmentData', teiId, programId, enrollmentId],
        {
            resource: 'tracker/trackedEntities',
            id: teiId,
            params: {
                program: programId,
                fields: ['enrollments[*,!attributes],attributes,inactive,programOwners[program,orgUnit]'],
            },
        },
        {
            enabled: !!teiId && !!programId && !!enrollmentId && storedEnrollmentId !== enrollmentId,
            staleTime: 0,
            cacheTime: 0,
        },
    ) as any;

    const fetchedEnrollmentData = {
        reference: data,
        enrollment: data?.enrollments
            ?.find((enrollment: any) => enrollment.enrollment === enrollmentId),
        attributeValues: data?.attributes,
        inactive: Boolean(data?.inactive),
        programOwnerId: data?.programOwners?.find((p: any) => p.program === programId)?.orgUnit,
    };

    useEffect(() => {
        if (fetchedEnrollmentData.reference && storedEnrollmentId !== enrollmentId) {
            dispatch(setCommonEnrollmentSiteData(
                fetchedEnrollmentData.enrollment,
                fetchedEnrollmentData.attributeValues
                    .map(({ attribute, value }: any) => ({ id: attribute, value })),
                fetchedEnrollmentData.inactive,
                fetchedEnrollmentData.programOwnerId,
            ));
        }
    }, [
        dispatch,
        enrollmentId,
        storedEnrollmentId,
        fetchedEnrollmentData.reference,
        fetchedEnrollmentData.enrollment,
        fetchedEnrollmentData.attributeValues,
        fetchedEnrollmentData.inactive,
        fetchedEnrollmentData.programOwnerId,
    ]);

    const inEffectData = enrollmentId === storedEnrollmentId ? {
        enrollment: storedEnrollment,
        attributeValues: storedAttributeValues,
        readOnly: Boolean(storedInactive),
        programOwnerId: storedProgramOwnerId,
    } : { enrollment: undefined, attributeValues: undefined, readOnly: false, programOwnerId: undefined };

    return {
        error,
        ...inEffectData,
    };
};
