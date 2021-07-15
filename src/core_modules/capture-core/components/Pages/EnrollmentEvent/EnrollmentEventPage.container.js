// @flow
import React from 'react';
// $FlowFixMe
import { useSelector, shallowEqual } from 'react-redux';
import { useEnrollment } from 'capture-core/hooks/useEnrollment';
import { useProgramInfo } from '../../../hooks/useProgramInfo';
import { pageMode } from './EnrollmentEventPage.const';
import { EnrollmentEventPageComponent } from './EnrollmentEventPage.component';

export const EnrollmentEventPage = () => {
    const { programId, stageId, teiId } = useSelector(
        ({
            router: {
                location: { query },
            },
        }) => ({
            programId: query.programId,
            teiId: query.teiId,
            stageId: query.stageId,
        }),
        shallowEqual,
    );
    const { program } = useProgramInfo(programId);
    const showEditEvent = useSelector(
        ({ viewEventPage }) =>
            viewEventPage?.eventDetailsSection?.showEditEvent,
    );
    const programStage = [...program.stages?.values()].find(
        item => item.id === stageId,
    );
    useEnrollment(teiId);

    return (
        <EnrollmentEventPageComponent
            mode={showEditEvent ? pageMode.EDIT : pageMode.VIEW}
            programStage={programStage}
        />
    );
};
