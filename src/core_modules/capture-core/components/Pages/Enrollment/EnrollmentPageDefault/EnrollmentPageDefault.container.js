// @flow
import React from 'react';
import { useSelector } from 'react-redux';
import { useProgramInfo } from '../../../../hooks/useProgramInfo';
import { EnrollmentPageDefaultComponent } from './EnrollmentPageDefault.component';

export const EnrollmentPageDefault = () => {
    const { enrollmentId, teiId, programId } = useSelector(({ router: { location: { query } } }) => ({
        enrollmentId: query.enrollmentId,
        teiId: query.teiId,
        programId: query.programId,
    }));

    const { program } = useProgramInfo(programId);

    return (
        <EnrollmentPageDefaultComponent
            program={program}
            enrollmentId={enrollmentId}
            teiId={teiId}
            programId={programId}
        />
    );
};
