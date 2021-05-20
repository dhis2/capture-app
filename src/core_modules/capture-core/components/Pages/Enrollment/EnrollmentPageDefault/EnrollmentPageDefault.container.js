// @flow
import React, { useMemo } from 'react';
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { useDataQuery } from '@dhis2/app-runtime';
// $FlowFixMe
import { useSelector, shallowEqual } from 'react-redux';
import { useProgramInfo } from '../../../../hooks/useProgramInfo';
import { EnrollmentPageDefaultComponent } from './EnrollmentPageDefault.component';

export const EnrollmentPageDefault = () => {
    const { enrollmentId, programId, teiId } = useSelector(
        ({
            router: {
                location: { query },
            },
        }) => ({
            enrollmentId: query.enrollmentId,
            teiId: query.teiId,
            programId: query.programId,
        }),
        shallowEqual,
    );

    const { program } = useProgramInfo(programId);
    const teiAttributesQuery = useMemo(() => ({
        teiAttributes: {
            resource: 'trackedEntityInstances',
            id: teiId,
            params: { fields: ['enrollments[*],attributes'] },
        },
    }), [teiId]);
    const { data: teiAttributes, error: teiError } = useDataQuery(teiAttributesQuery);

    if (teiError) {
        log.error(errorCreator('Enrollment page could not be loaded')({ teiError }));
    }

    return (
        <EnrollmentPageDefaultComponent
            teiId={teiId}
            program={program}
            events={teiAttributes?.teiAttributes?.enrollments?.[0].events ?? []}
            enrollmentId={enrollmentId}
        />
    );
};
