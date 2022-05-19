// @flow
import { useEffect, useMemo } from 'react';
// $FlowFixMe
import { useSelector, useDispatch } from 'react-redux';
import { useDataQuery } from '@dhis2/app-runtime';
import { setCommonEnrollmentSiteData } from '../enrollment.actions';
import type { Output } from './useCommonEnrollmentDomainData.types';

export const useCommonEnrollmentDomainData = (teiId: string, enrollmentId: string, programId: string): Output => {
    const dispatch = useDispatch();

    const {
        enrollmentId: storedEnrollmentId,
        enrollment: storedEnrollment,
        attributeValues: storedAttributeValues,
        relationships: storedRelationships,
    } = useSelector(({ enrollmentDomain }) => enrollmentDomain);

    const { data, error, refetch } = useDataQuery(
        useMemo(
            () => ({
                trackedEntityInstance: {
                    resource: 'tracker/trackedEntities',
                    id: ({ variables: { teiId: updatedTeiId } }) => updatedTeiId,
                    params: ({ variables: { programId: updatedProgramId } }) => ({
                        program: updatedProgramId,
                        fields: ['enrollments[*],attributes'],
                    }),
                },
            }),
            [],
        ),
        { lazy: true },
    );

    const {
        data: relationshipsData,
        error: relationshipsError,
        refetch: refetchRelationships,
    } = useDataQuery(
        useMemo(
            () => ({
                teiRelationships: {
                    resource: 'tracker/relationships',
                    params: ({ variables: { teiId: updatedTeiId } }) => ({
                        tei: updatedTeiId,
                        fields: ['relationshipType,to,from,createdAt'],
                    }),
                },
            }),
            [],
        ),
        { lazy: true },
    );

    const fetchedEnrollmentData = {
        reference: data,
        enrollment: data?.trackedEntityInstance?.enrollments
            ?.find(enrollment => enrollment.enrollment === enrollmentId),
        attributeValues: data?.trackedEntityInstance?.attributes,
        relationships: relationshipsData?.teiRelationships?.instances,
    };

    useEffect(() => {
        if (fetchedEnrollmentData.reference) {
            dispatch(setCommonEnrollmentSiteData(
                fetchedEnrollmentData.enrollment,
                fetchedEnrollmentData.attributeValues
                    .map(({ attribute, value }) => ({ id: attribute, value })),
                fetchedEnrollmentData.relationships,
            ));
        }
    }, [
        dispatch,
        fetchedEnrollmentData.reference,
        fetchedEnrollmentData.enrollment,
        fetchedEnrollmentData.attributeValues,
        fetchedEnrollmentData.relationships,
    ]);

    useEffect(() => {
        if (storedEnrollmentId !== enrollmentId) {
            refetch({ variables: { teiId, programId } });
            refetchRelationships({ variables: { teiId } });
        }
    }, [refetch, refetchRelationships, storedEnrollmentId, enrollmentId, teiId, programId]);

    const inEffectData = enrollmentId === storedEnrollmentId ? {
        enrollment: storedEnrollment,
        attributeValues: storedAttributeValues,
        relationships: storedRelationships,
    } : { enrollment: undefined, attributeValues: undefined, relationships: undefined };

    return {
        error: error || relationshipsError,
        ...inEffectData,
    };
};
