// @flow
import React, { useCallback } from 'react';
// $FlowFixMe
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useHistory } from 'react-router';
import {
    addEnrollmentEventPageActionTypes,
    navigateToEnrollmentPage,
} from './enrollmentAddEventPage.actions';
import { useProgramInfo } from '../../../hooks/useProgramInfo';
import { EnrollmentAddEventPageComponent } from './EnrollmentAddEventPage.component';
import { urlArguments } from '../../../utils/url';
import { deleteEnrollment } from '../Enrollment/EnrollmentPage.actions';
import { useWidgetDataFromStore } from './hooks';
import { useHideWidgetByRuleLocations } from '../Enrollment/EnrollmentPageDefault/hooks';

export const EnrollmentAddEventPage = () => {
    const history = useHistory();
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
        dispatch(navigateToEnrollmentPage(programId, orgUnitId, teiId, enrollmentId));
    }, [dispatch, programId, orgUnitId, teiId, enrollmentId]);

    const handleSave = useCallback(() => {
        dispatch(navigateToEnrollmentPage(programId, orgUnitId, teiId, enrollmentId));
    }, [dispatch, programId, orgUnitId, teiId, enrollmentId]);

    const handleDelete = useCallback(() => {
        history.push(
            `/enrollment?${urlArguments({ orgUnitId, programId, teiId })}`,
        );
        dispatch(deleteEnrollment({ enrollmentId }));
    }, [dispatch, history, programId, orgUnitId, teiId, enrollmentId]);

    // TODO: Validate query params
    // Ticket: https://jira.dhis2.org/browse/TECH-669
    const { program } = useProgramInfo(programId);
    const programStage = [...program.stages.values()].find(item => item.id === stageId);
    const outputEffects = useWidgetDataFromStore('singleEvent-addEvent');
    const hideWidgets = useHideWidgetByRuleLocations(program.programRules);

    if (!programStage) {
        return <span>[program stage placeholder]</span>;
    }

    // TODO: Get data from enrollment collection for the rules engine
    // Ticket: https://jira.dhis2.org/browse/TECH-635

    return (
        <EnrollmentAddEventPageComponent
            programId={programId}
            stageId={stageId}
            enrollmentId={enrollmentId}
            orgUnitId={orgUnitId}
            teiId={teiId}
            onSave={handleSave}
            onSaveSuccessActionType={addEnrollmentEventPageActionTypes.EVENT_SAVE_SUCCESS}
            onSaveErrorActionType={addEnrollmentEventPageActionTypes.EVENT_SAVE_ERROR}
            onCancel={handleCancel}
            onDelete={handleDelete}
            widgetEffects={outputEffects}
            hideWidgets={hideWidgets}
        />
    );
};
