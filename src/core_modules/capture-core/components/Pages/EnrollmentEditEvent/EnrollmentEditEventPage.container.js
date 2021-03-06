// @flow
import React, { useState } from 'react';
// $FlowFixMe
import { useSelector, shallowEqual } from 'react-redux';
import { useProgramInfo } from '../../../hooks/useProgramInfo';
import { pageMode } from './EnrollmentEditEventPage.const';
import { EnrollmentEditEventPageComponent } from './EnrollmentEditEventPage.component';

export const EnrollmentEditEventPage = () => {
    const { programId, stageId } = useSelector(
        ({
            router: {
                location: { query },
            },
        }) => ({
            programId: query.programId,
            stageId: query.stageId,
        }),
        shallowEqual,
    );
    const [mode] = useState(pageMode.VIEW);
    const { program } = useProgramInfo(programId);
    const programStage = [...program.stages?.values()].find(
        item => item.id === stageId,
    );
    return (
        <EnrollmentEditEventPageComponent mode={mode} programStage={programStage} />
    );
};
