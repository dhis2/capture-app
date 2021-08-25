// @flow
import React, { useCallback } from 'react';
// $FlowFixMe
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { addEnrollmentEventPageActionTypes, cancelSaveEvent } from './enrollmentAddEventPage.actions';
import { useProgramInfo } from '../../../hooks/useProgramInfo';
import { EnrollmentAddEventPageComponent } from './EnrollmentAddEventPage.component';

export const EnrollmentAddEventPage = () => {
    const { programId, stageId, orgUnitId, teiId, enrollmentId } = useSelector(
        ({
            router: {
                location: { query },
            },
        }) => ({
            programId: query.programId,
            stageId: query.stageId,
            orgUnitId: query.orgUnitId,
            teiId: query.teiId,
            enrollmentId: query.enrollmentId,
        }),
        shallowEqual,
    );

    const dispatch = useDispatch();
    const handleCancel = useCallback(() => {
        dispatch(cancelSaveEvent());
    }, [dispatch]);

    // TODO: Validate query params
    const { program } = useProgramInfo(programId);
    const programStage = [...program.stages.values()].find(item => item.id === stageId);
    if (!programStage) {
        return <span>[program stage placeholder]</span>;
    }

    // TODO: Get data from enrollment collection for the rules engine

    return (
        <EnrollmentAddEventPageComponent
            programId={programId}
            stageId={stageId}
            enrollmentId={enrollmentId}
            orgUnitId={orgUnitId}
            teiId={teiId}
            onSaveActionType={addEnrollmentEventPageActionTypes.EVENT_SAVE}
            onSaveSuccessActionType={addEnrollmentEventPageActionTypes.EVENT_SAVE_SUCCESS}
            onCancel={handleCancel}
        />
    );
};
