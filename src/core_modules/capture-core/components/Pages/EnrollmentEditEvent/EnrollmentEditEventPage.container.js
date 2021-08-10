// @flow
import React from 'react';
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
    const { program } = useProgramInfo(programId);
    const showEditEvent = useSelector(({ viewEventPage }) => viewEventPage?.eventDetailsSection?.showEditEvent);
    const programStage = [...program.stages?.values()].find(item => item.id === stageId);

    return (
        <EnrollmentEditEventPageComponent
            mode={showEditEvent ? pageMode.EDIT : pageMode.VIEW}
            programStage={programStage}
        />
    );
};
