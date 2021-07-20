// @flow
import React from 'react';
// $FlowFixMe
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { useProgramInfo } from '../../../hooks/useProgramInfo';
import { EnrollmentAddEventPageComponent } from './EnrollmentAddEventPage.component';
import { urlArguments } from '../../../utils/url';
import { deleteEnrollment } from '../Enrollment/EnrollmentPage.actions';
import { useStoredWidgetDataFromStore } from './hooks';

export const EnrollmentAddEventPage = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { programId, stageId, teiId, enrollmentId, orgUnitId } = useSelector(
        ({
            router: {
                location: { query },
            },
        }) => ({
            programId: query.programId,
            stageId: query.stageId,
            teiId: query.teiId,
            enrollmentId: query.enrollmentId,
            orgUnitId: query.orgUnitId,
        }),
        shallowEqual,
    );
    const outputEffects = useStoredWidgetDataFromStore();
    const { program } = useProgramInfo(programId);
    const programStage = [...program.stages.values()].find(item => item.id === stageId);

    if (!programStage) {
        return <span>[program stage placeholder]</span>;
    }

    const onDelete = () => {
        history.push(
            `/enrollment?${urlArguments({ orgUnitId, programId, teiId })}`,
        );
        dispatch(deleteEnrollment({ enrollmentId }));
    };

    return (
        <EnrollmentAddEventPageComponent
            program={program}
            teiId={teiId}
            enrollmentId={enrollmentId}
            onDelete={onDelete}
            programStage={programStage}
            widgetEffects={outputEffects}
        />
    );
};
