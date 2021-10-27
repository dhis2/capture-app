// @flow
import React, { useCallback, useMemo } from 'react';
// $FlowFixMe
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import i18n from '@dhis2/d2-i18n';
import { useLocationQuery } from '../../../utils/routing';
import { addEnrollmentEventPageActionTypes } from './enrollmentAddEventPage.actions';
import { useProgramInfo } from '../../../hooks/useProgramInfo';
import { useEnrollmentAddEventTopBar, EnrollmentAddEventTopBar } from './TopBar';
import { EnrollmentAddEventPageComponent } from './EnrollmentAddEventPage.component';
import { deleteEnrollment } from '../Enrollment/EnrollmentPage.actions';
import { useWidgetDataFromStore } from './hooks';
import { useHideWidgetByRuleLocations } from '../Enrollment/EnrollmentPageDefault/hooks';
import { useCommonEnrollmentDomainData, updateEnrollmentEventsWithoutId } from '../common/EnrollmentOverviewDomain';
import { dataEntryHasChanges as getDataEntryHasChanges } from '../../DataEntry/common/dataEntryHasChanges';
import { urlArguments } from '../../../utils/url';

export const EnrollmentAddEventPage = () => {
    const { programId, stageId, orgUnitId, teiId, enrollmentId } = useLocationQuery();
    const history = useHistory();
    const dispatch = useDispatch();

    const navigateToEnrollmentPage = useCallback(() =>
        history.push(
            `/enrollment?${urlArguments({ programId, orgUnitId, teiId, enrollmentId })}`,
        ), [enrollmentId, history, orgUnitId, programId, teiId]);

    const handleCancel = useCallback(() => {
        navigateToEnrollmentPage();
    }, [navigateToEnrollmentPage]);

    const handleSave = useCallback(
        (data, uid) => {
            dispatch(updateEnrollmentEventsWithoutId(uid, data.events[0]));
            navigateToEnrollmentPage();
        },
        [dispatch, navigateToEnrollmentPage],
    );

    const handleDelete = useCallback(() => {
        dispatch(deleteEnrollment({ enrollmentId }));
        navigateToEnrollmentPage();
    }, [dispatch, enrollmentId, navigateToEnrollmentPage]);

    const widgetReducerName = 'enrollmentEvent-newEvent';

    const dataEntryHasChanges = useSelector(state => getDataEntryHasChanges(state, widgetReducerName));

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
                dataEntryHasChanges={dataEntryHasChanges}
            />
        </>
    );
};
