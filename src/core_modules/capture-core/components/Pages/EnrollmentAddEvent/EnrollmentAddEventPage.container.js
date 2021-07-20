// @flow
import React from 'react';
// $FlowFixMe
import { useSelector, shallowEqual } from 'react-redux';
import { useProgramInfo } from '../../../hooks/useProgramInfo';
import { EnrollmentAddEventPageComponent } from './EnrollmentAddEventPage.component';

export const EnrollmentAddEventPage = () => {
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
    const { program } = useProgramInfo(programId);
    const programStage = [...program.stages.values()].find(item => item.id === stageId);
    if (!programStage) {
        return <span>[program stage placeholder]</span>;
    }
    return (
        <EnrollmentAddEventPageComponent programStage={programStage} programId={programId} />
    );
};
