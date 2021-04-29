// @flow
import React from 'react';
import { useSelector } from 'react-redux';
import { useProgramInfo } from '../../../../hooks/useProgramInfo';
import { EnrollmentPageDefaultComponent } from './EnrollmentPageDefault.component';

export const EnrollmentPageDefault = () => {
    const { teiId, programId } = useSelector(({
        router: {
            location: {
                query,
            },
        },
    }) => ({ teiId: query.teiId, programId: query.programId }));

    const { program } = useProgramInfo(programId);


    return (
        <EnrollmentPageDefaultComponent
            teiId={teiId}
            programId={programId}
            program={program}
        />
    );
};
