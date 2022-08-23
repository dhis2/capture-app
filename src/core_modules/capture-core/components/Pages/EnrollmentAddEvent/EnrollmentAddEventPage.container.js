// @flow
import React, { useCallback, useMemo } from 'react';
import { batchActions } from 'redux-batched-actions';
// $FlowFixMe
import { useDispatch } from 'react-redux';
import i18n from '@dhis2/d2-i18n';
import { useLocationQuery } from '../../../utils/routing';
import { addEnrollmentEventPageActionTypes, navigateToEnrollmentPage } from './enrollmentAddEventPage.actions';
import { useProgramInfo } from '../../../hooks/useProgramInfo';
import { useEnrollmentAddEventTopBar, EnrollmentAddEventTopBar } from './TopBar';
import { EnrollmentAddEventPageComponent } from './EnrollmentAddEventPage.component';
import { deleteEnrollment } from '../Enrollment/EnrollmentPage.actions';
import { useWidgetDataFromStore } from './hooks';
import { useHideWidgetByRuleLocations } from '../Enrollment/EnrollmentPageDefault/hooks';
import {
    useCommonEnrollmentDomainData,
    updateEnrollmentEventsWithoutId,
    showEnrollmentError,
} from '../common/EnrollmentOverviewDomain';

export const EnrollmentAddEventPage = () => {
    const { programId, stageId, orgUnitId, teiId, enrollmentId } = useLocationQuery();

    const dispatch = useDispatch();

    const handleCancel = useCallback(() => {
        dispatch(navigateToEnrollmentPage(programId, orgUnitId, teiId, enrollmentId));
    }, [dispatch, programId, orgUnitId, teiId, enrollmentId]);

    const handleSave = useCallback(
        (data, uid) => {
            dispatch(updateEnrollmentEventsWithoutId(uid, data.events[0]));
            dispatch(navigateToEnrollmentPage(programId, orgUnitId, teiId, enrollmentId));
        },
        [dispatch, programId, orgUnitId, teiId, enrollmentId],
    );
    const onEnrollmentError = message => dispatch(showEnrollmentError({ message }));

    const handleDelete = useCallback(() => {
        dispatch(batchActions([
            deleteEnrollment({ enrollmentId }),
            navigateToEnrollmentPage(programId, orgUnitId, teiId),
        ]));
    }, [dispatch, programId, orgUnitId, teiId, enrollmentId]);

    const widgetReducerName = 'enrollmentEvent-newEvent';

    // TODO: Validate query params
    // This includes prechecking that we got a valid program stage and move the program stage logic in this file to useEnrollmentAddEventTopBar
    // Ticket: https://jira.dhis2.org/browse/TECH-669
    const { program } = useProgramInfo(programId);
    const programStage = [...program.stages.values()].find(item => item.id === stageId);
    const outputEffects = useWidgetDataFromStore(widgetReducerName);
    const hideWidgets = useHideWidgetByRuleLocations(program.programRules);
    const {
        enrollment,
        attributeValues,
        error: commonDataError,
    } = useCommonEnrollmentDomainData(teiId, enrollmentId, programId);

    const rulesExecutionDependencies = useMemo(() => ({
        events: enrollment?.events,
        attributeValues,
        enrollmentData: {
            enrollmentDate: enrollment?.enrollmentDate,
            incidentDate: enrollment?.incidentDate,
            enrollmentId: enrollment?.enrollment,
        },
    }), [enrollment, attributeValues]);

    const {
        handleSetOrgUnitId,
        handleResetOrgUnitId,
        handleResetProgramId,
        handleResetEnrollmentId,
        handleResetTeiId,
        handleResetStageId,
        handleResetEventId,
        teiDisplayName,
        trackedEntityName,
        enrollmentsAsOptions,
        teiSelectorFailure,
        userInteractionInProgress,
    } = useEnrollmentAddEventTopBar(teiId, programId, enrollment);

    if (!programStage) {
        return <div>{i18n.t('program stage is invalid')}</div>;
    }

    return (
        <>
            <EnrollmentAddEventTopBar
                programId={programId}
                orgUnitId={orgUnitId}
                enrollmentId={enrollmentId}
                teiDisplayName={teiDisplayName}
                trackedEntityName={trackedEntityName}
                stageName={programStage.name}
                eventDateLabel={programStage.stageForm.getLabel('eventDate')}
                enrollmentsAsOptions={enrollmentsAsOptions}
                onSetOrgUnitId={handleSetOrgUnitId}
                onResetOrgUnitId={handleResetOrgUnitId}
                onResetProgramId={handleResetProgramId}
                onResetEnrollmentId={handleResetEnrollmentId}
                onResetTeiId={handleResetTeiId}
                onResetStageId={handleResetStageId}
                onResetEventId={handleResetEventId}
                userInteractionInProgress={userInteractionInProgress}
                teiSelectorFailure={teiSelectorFailure}
                enrollmentSelectorFailure={Boolean(commonDataError)}
            />
            <EnrollmentAddEventPageComponent
                programId={programId}
                stageId={stageId}
                orgUnitId={orgUnitId}
                teiId={teiId}
                enrollmentId={enrollmentId}
                onSave={handleSave}
                onSaveSuccessActionType={addEnrollmentEventPageActionTypes.EVENT_SAVE_SUCCESS}
                onSaveErrorActionType={addEnrollmentEventPageActionTypes.EVENT_SAVE_ERROR}
                onCancel={handleCancel}
                onDelete={handleDelete}
                widgetEffects={outputEffects}
                hideWidgets={hideWidgets}
                widgetReducerName={widgetReducerName}
                rulesExecutionDependencies={rulesExecutionDependencies}
                pageFailure={Boolean(commonDataError)}
                ready={Boolean(enrollment)}
                onEnrollmentError={onEnrollmentError}
            />
        </>
    );
};
