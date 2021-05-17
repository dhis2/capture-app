// @flow
import React from 'react';
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
    const events = useSelector(({
        enrollmentPage,
    }) => enrollmentPage?.enrollments?.[0].events, shallowEqual);

    return (
        <EnrollmentPageDefaultComponent
            teiId={teiId}
            program={program}
            events={events}
            enrollmentId={enrollmentId}
        />
    );
};
