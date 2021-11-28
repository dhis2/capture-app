// @flow
import React, { useCallback, useMemo } from 'react';
// $FlowFixMe
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { buildUrlQueryString, useLocationQuery } from '../../../utils/routing';
import { useProgramInfo } from '../../../hooks/useProgramInfo';
import { useEnrollmentAddEventTopBar, EnrollmentAddEventTopBar } from './TopBar';
import { EnrollmentAddEventPageComponent } from './EnrollmentAddEventPage.component';
import { deleteEnrollment } from '../Enrollment/EnrollmentPage.actions';
import { useWidgetDataFromStore } from './hooks';
import { useHideWidgetByRuleLocations } from '../Enrollment/EnrollmentPageDefault/hooks';
import { useCommonEnrollmentDomainData, updateEnrollmentEventsWithoutId } from '../common/EnrollmentOverviewDomain';
import { dataEntryHasChanges as getDataEntryHasChanges } from '../../DataEntry/common/dataEntryHasChanges';

export const EnrollmentAddEventPage = () => {
    const { programId, stageId, orgUnitId, teiId, enrollmentId } = useLocationQuery();
    const history = useHistory();
    const dispatch = useDispatch();

    const handleCancel = useCallback(() => {
        history.push(`/enrollment?${buildUrlQueryString({ orgUnitId, programId, teiId, enrollmentId })}`);
    }, [history, orgUnitId, programId, teiId, enrollmentId]);

    const handleSave = useCallback(
        (data, uid) => {
            history.push(`/enrollment?${buildUrlQueryString({ orgUnitId, programId, teiId, enrollmentId })}`);
            dispatch(updateEnrollmentEventsWithoutId(uid, data.events[0]));
        },
        [history, orgUnitId, programId, teiId, enrollmentId, dispatch],
    );

    const handleDelete = useCallback(() => {
        dispatch(deleteEnrollment({ enrollmentId }));
        history.push(`/enrollment?${buildUrlQueryString({ orgUnitId, programId, teiId, enrollmentId })}`);
    }, [dispatch, enrollmentId, history, orgUnitId, programId, teiId]);

    const widgetReducerName = 'enrollmentEvent-newEvent';

    const dataEntryHasChanges = useSelector(state => getDataEntryHasChanges(state, widgetReducerName));

    // TODO: Validate query params
    // This includes prechecking that we got a valid program stage and move the program stage logic in this file to useEnrollmentAddEventTopBar
    // Ticket: https://jira.dhis2.org/browse/TECH-669
    const { program } = useProgramInfo(programId);
    const selectedProgramStage = [...program.stages.values()].find(item => item.id === stageId);
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

    return (
        <>
            <EnrollmentAddEventTopBar
                programId={programId}
                orgUnitId={orgUnitId}
                enrollmentId={enrollmentId}
                teiDisplayName={teiDisplayName}
                trackedEntityName={trackedEntityName}
                stageName={selectedProgramStage?.stageForm.name}
                eventDateLabel={selectedProgramStage?.stageForm.getLabel('eventDate')}
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
