// @flow
import React, { useState } from 'react';
// $FlowFixMe
import { useSelector, shallowEqual } from 'react-redux';
import { useProgramInfo } from '../../../hooks/useProgramInfo';
import { pageMode } from './EnrollmentEventPage.const';
import { EnrollmentEventPageComponent } from './EnrollmentEventPage.component';

export const EnrollmentEventPage = () => {
    const { eventId, programId, stageId } = useSelector(
        ({
            router: {
                location: { query },
            },
        }) => ({
            eventId: query.eventId,
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
        <EnrollmentEventPageComponent
            mode={mode}
            programStage={programStage}
            eventId={eventId}
        />
    );
};
