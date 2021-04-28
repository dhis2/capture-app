// @flow
import React, { useMemo, useState, useEffect } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';
import { WidgetEnrollment } from './WidgetEnrollment.component';
import type { Props } from './enrollment.types';

// eslint-disable-next-line complexity
export const WidgetEnrollmentContainer = ({ enrollmentId, programId, teiId }: Props) => {
    const [ownerOrgUnit, setOwnerOrgUnit] = useState('');

    const enrollmentQuery = useMemo(() => ({
        enrollment: {
            resource: `enrollments/${enrollmentId}`,
        },
    }), [enrollmentId]);

    const programQuery = useMemo(() => ({
        programs: {
            resource: `programs/${programId}`,
            params: {
                fields: ['displayIncidentDate,incidentDateLabel,enrollmentDateLabel'],
            },
        },
    }), [programId]);

    const trackedEntityInstancesQuery = useMemo(() => ({
        trackedEntityInstances: {
            resource: `trackedEntityInstances/${teiId}`,
            params: {
                fields: ['programOwners[ownerOrgUnit]'],
                program: [programId],
            },
        },
    }), [teiId, programId]);

    const organisationUnitsQuery = useMemo(() => ({
        organisationUnits: {
            resource: `organisationUnits/${ownerOrgUnit}`,
            params: {
                fields: ['displayName'],
            },
        },
    }), [ownerOrgUnit]);

    const enrollmentFetch = useDataQuery(enrollmentQuery);
    const programFetch = useDataQuery(programQuery);
    const trackedEntityInstancesFetch = useDataQuery(trackedEntityInstancesQuery);
    const organisationUnitsFetch = useDataQuery(organisationUnitsQuery);

    useEffect(() => {
        if (trackedEntityInstancesFetch.data &&
        trackedEntityInstancesFetch.data.trackedEntityInstances &&
        trackedEntityInstancesFetch.data.trackedEntityInstances.programOwners &&
        trackedEntityInstancesFetch.data.trackedEntityInstances.programOwners[0].ownerOrgUnit) {
            setOwnerOrgUnit(
                trackedEntityInstancesFetch.data.trackedEntityInstances.programOwners[0].ownerOrgUnit);
        }
    }, [trackedEntityInstancesFetch.data]);


    if (enrollmentFetch.error) {
        throw enrollmentFetch.error;
    }
    if (programFetch.error) {
        throw programFetch.error;
    }
    if (trackedEntityInstancesFetch.error) {
        throw trackedEntityInstancesFetch.error;
    }
    if (organisationUnitsFetch.error) {
        throw trackedEntityInstancesFetch.error;
    }

    console.log(organisationUnitsFetch.data && organisationUnitsFetch.data.organisationUnits);

    return enrollmentFetch.data && programFetch.data ?
        <WidgetEnrollment
            enrollment={enrollmentFetch.data.enrollment}
            program={programFetch.data.programs}
        />
        :
        <></>;
};

