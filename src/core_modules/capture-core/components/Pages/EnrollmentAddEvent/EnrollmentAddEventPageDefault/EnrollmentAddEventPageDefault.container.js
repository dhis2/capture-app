// @flow
import React, { useCallback, useMemo } from 'react';
import { batchActions } from 'redux-batched-actions';
// $FlowFixMe
import { useDispatch, useSelector } from 'react-redux';
import i18n from '@dhis2/d2-i18n';
import { useLocationQuery } from '../../../../utils/routing';
import { addEnrollmentEventPageActionTypes, navigateToEnrollmentPage } from './EnrollmentAddEventPageDefault.actions';
import { useProgramInfo } from '../../../../hooks/useProgramInfo';
import { useEnrollmentAddEventTopBar, EnrollmentAddEventTopBar } from '../TopBar';
import { EnrollmentAddEventPageDefaultComponent } from './EnrollmentAddEventPageDefault.component';
import { deleteEnrollment } from '../../Enrollment/EnrollmentPage.actions';
import { useWidgetDataFromStore } from '../hooks';
import {
    useHideWidgetByRuleLocations,
} from '../../Enrollment/EnrollmentPageDefault/hooks';
import { updateEnrollmentEventsWithoutId } from '../../common/EnrollmentOverviewDomain';
import { dataEntryHasChanges as getDataEntryHasChanges } from '../../../DataEntry/common/dataEntryHasChanges';
import type { ContainerProps } from './EnrollmentAddEventPageDefault.types';

export const EnrollmentAddEventPageDefault = ({
    enrollment,
    attributeValues,
    commonDataError,
}: ContainerProps) => {
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

    const handleDelete = useCallback(() => {
        dispatch(batchActions([
            deleteEnrollment({ enrollmentId }),
            navigateToEnrollmentPage(programId, orgUnitId, teiId),
        ]));
    }, [dispatch, programId, orgUnitId, teiId, enrollmentId]);

    const widgetReducerName = 'enrollmentEvent-newEvent';

    const dataEntryHasChanges = useSelector(state => getDataEntryHasChanges(state, widgetReducerName));
    const { program } = useProgramInfo(programId);
    const selectedProgramStage = [...program.stages.values()].find(item => item.id === stageId);
    const outputEffects = useWidgetDataFromStore(widgetReducerName);
    const hideWidgets = useHideWidgetByRuleLocations(program.programRules);

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

    if (stageId && !selectedProgramStage) {
        return <p style={{ color: 'red' }}>{i18n.t('Program stage is invalid')}</p>;
    }

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
                enrollmentSelectorFailure={commonDataError}
            />
            <EnrollmentAddEventPageDefaultComponent
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
                pageFailure={commonDataError}
                ready={Boolean(enrollment)}
                dataEntryHasChanges={dataEntryHasChanges}
            />
        </>
    );
};
