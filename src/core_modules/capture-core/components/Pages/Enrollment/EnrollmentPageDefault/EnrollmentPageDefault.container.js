// @flow
import React from 'react';
// $FlowFixMe
import { useSelector, shallowEqual } from 'react-redux';
import { useProgramInfo } from '../../../../hooks/useProgramInfo';
import { EnrollmentPageDefaultComponent } from './EnrollmentPageDefault.component';

export const EnrollmentPageDefault = () => {
    const { teiId, programId } = useSelector(({
        router: {
            location: {
                query,
            },
        },
    }) => ({ teiId: query.teiId, programId: query.programId }), shallowEqual);

    const { program } = useProgramInfo(programId);
    const events = useSelector(({
        enrollmentPage,
    }) => enrollmentPage?.enrollments?.[0].events, shallowEqual);

    return (
        <EnrollmentPageDefaultComponent
            teiId={teiId}
            program={program}
            events={events}
        />
    );
};
