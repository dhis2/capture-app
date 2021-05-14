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

    return (
        <EnrollmentPageDefaultComponent
            teiId={teiId}
            program={program}
            enrollmentId={enrollmentId}
        />
    );
};
