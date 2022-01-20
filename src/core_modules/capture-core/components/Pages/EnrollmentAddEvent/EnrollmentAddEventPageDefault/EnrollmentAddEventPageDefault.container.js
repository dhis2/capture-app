// @flow
import React, { useCallback, useMemo } from 'react';
// $FlowFixMe
import { useDispatch, useSelector } from 'react-redux';
import i18n from '@dhis2/d2-i18n';
import { useHistory } from 'react-router-dom';
import { NoticeBox } from '@dhis2/ui';
import { buildUrlQueryString, useLocationQuery } from '../../../../utils/routing';
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

    const history = useHistory();
    const dispatch = useDispatch();

    const handleCancel = useCallback(() => {
        history.push(`enrollment?${buildUrlQueryString({ programId, orgUnitId, teiId, enrollmentId })}`);
    }, [history, programId, orgUnitId, teiId, enrollmentId]);

    const handleSave = useCallback(
        (data, uid) => {
            dispatch(updateEnrollmentEventsWithoutId(uid, data.events[0]));
            history.push(`enrollment?${buildUrlQueryString({ programId, orgUnitId, teiId, enrollmentId })}`);
        },
        [dispatch, history, programId, orgUnitId, teiId, enrollmentId],
    );

    const handleDelete = useCallback(() => {
        dispatch(deleteEnrollment({ enrollmentId }));
        history.push(`enrollment?${buildUrlQueryString({ programId, orgUnitId, teiId })}`);
    }, [dispatch, enrollmentId, history, programId, orgUnitId, teiId]);

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
        return (
            <NoticeBox
                error
                title={'An error has occurred'}
            >
                {i18n.t('Program stage is invalid')}
            </NoticeBox>
        );
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
