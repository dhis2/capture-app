// @flow
import React from 'react';
// $FlowFixMe
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useProgramInfo } from '../../../hooks/useProgramInfo';
import { pageMode } from './EnrollmentEventPage.const';
import { EnrollmentEventPageComponent } from './EnrollmentEventPage.component';
import { startShowEditEventDataEntry } from './EnrollmentEventPage.actions';

export const EnrollmentEventPage = () => {
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
    const dispatch = useDispatch();
    const showEditEvent = useSelector(
        ({ viewEventPage }) =>
            viewEventPage?.eventDetailsSection?.showEditEvent,
    );
    const programStage = [...program.stages?.values()].find(
        item => item.id === stageId,
    );

    return (
        <EnrollmentEventPageComponent
            mode={showEditEvent ? pageMode.EDIT : pageMode.VIEW}
            programStage={programStage}
            onEdit={() => dispatch(startShowEditEventDataEntry())}
        />
    );
};
