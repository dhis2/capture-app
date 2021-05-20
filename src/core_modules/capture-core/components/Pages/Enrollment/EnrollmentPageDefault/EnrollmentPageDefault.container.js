// @flow
import React, { useMemo } from 'react';
// $FlowFixMe
import { useSelector, shallowEqual } from 'react-redux';
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { useDataQuery } from '@dhis2/app-runtime';
import { useProgramInfo } from '../../../../hooks/useProgramInfo';
import { EnrollmentPageDefaultComponent } from './EnrollmentPageDefault.component';
import { useRunRulesForEnrollement } from '../hooks';

export const EnrollmentPageDefault = () => {
    const { enrollmentId, teiId, programId, orgUnitId } = useSelector(({
        router: {
            location: {
                query,
            },
        },
    }) => (
        { enrollmentId: query.enrollmentId,
            teiId: query.teiId,
            programId: query.programId,
            orgUnitId: query.orgUnitId,
        }), shallowEqual);
    const orgUnit = useSelector(({ organisationUnits }) => organisationUnits[orgUnitId], shallowEqual);

    const { program } = useProgramInfo(programId);

    const teiAttributesQuery = useMemo(() => ({
        teiAttributes: {
            resource: 'trackedEntityInstances',
            id: teiId,
            params: { fields: ['enrollments[*],attributes'] },
        },
    }), [teiId]);

    const programsQuery = useMemo(() => ({
        programData: {
            resource: 'programs',
            id: programId,
            params: {
                fields:
                ['programStages[programStageDataElements[dataElement[id,valueType,optionSet[id,version]]'],
            },
        },
    }), [programId]);

    const { data: programStagesData, error: programStageError } = useDataQuery(programsQuery);
    const { data: teiAttributes, error: teiError } = useDataQuery(teiAttributesQuery);

    if (programStageError || teiError) {
        log.error(errorCreator('Enrollment page could not be loaded')({ programStageError, teiError }));
    }

    const rules = useRunRulesForEnrollement(orgUnit, program, programStagesData, teiAttributes);
    console.log({ rules });

    return (
        <EnrollmentPageDefaultComponent
            teiId={teiId}
            program={program}
            enrollmentId={enrollmentId}
        />
    );
};
