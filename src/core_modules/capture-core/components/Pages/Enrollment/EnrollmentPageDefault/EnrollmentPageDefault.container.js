// @flow
import React from 'react';
import { useSelector } from 'react-redux';
import { useProgramInfo } from '../../../../hooks/useProgramInfo';
import { EnrollmentPageDefaultComponent } from './EnrollmentPageDefault.component';

export const EnrollmentPageDefault = () => {
    const programId = useSelector(({
        router: {
            location: {
                query,
            },
        },
    }) => query.programId);

    const { program } = useProgramInfo(programId);

    return (
        <EnrollmentPageDefaultComponent
            program={program}
        />
    );
};
