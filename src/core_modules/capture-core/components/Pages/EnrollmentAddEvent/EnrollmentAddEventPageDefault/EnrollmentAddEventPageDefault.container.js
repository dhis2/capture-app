// @flow
import React, { useCallback, useMemo } from 'react';
import moment from 'moment';
// $FlowFixMe
import { useDispatch, useSelector } from 'react-redux';
import { useConfig, useTimeZoneConversion } from '@dhis2/app-runtime';
import i18n from '@dhis2/d2-i18n';
import { useNavigate } from 'capture-core/utils/routing';
import { NoticeBox } from '@dhis2/ui';
import { buildUrlQueryString, useLocationQuery } from '../../../../utils/routing';
import { useProgramInfo } from '../../../../hooks/useProgramInfo';
import { EnrollmentAddEventTopBar, useEnrollmentAddEventTopBar } from '../TopBar';
import { deleteEnrollment, fetchEnrollments } from '../../Enrollment/EnrollmentPage.actions';
import { actions as RelatedStageModes } from '../../../WidgetRelatedStages/constants';

import { useWidgetDataFromStore } from '../hooks';
import { useHideWidgetByRuleLocations } from '../../Enrollment/EnrollmentPageDefault/hooks';
import {
    commitEnrollmentAndEvents,
    rollbackEnrollmentAndEvents,
    setExternalEnrollmentStatus,
    showEnrollmentError,
    updateEnrollmentAndEvents,
    updateOrAddEnrollmentEvents,
} from '../../common/EnrollmentOverviewDomain';
import { dataEntryHasChanges as getDataEntryHasChanges } from '../../../DataEntry/common/dataEntryHasChanges';
import type { ContainerProps } from './EnrollmentAddEventPageDefault.types';
import { WidgetsForEnrollmentEventNew } from '../PageLayout/DefaultPageLayout.constants';
import { EnrollmentAddEventPageDefaultComponent } from './EnrollmentAddEventPageDefault.component';
import { convertEventAttributeOptions } from '../../../../events/convertEventAttributeOptions';

export const EnrollmentAddEventPageDefault = ({
    pageLayout,
    enrollment,
    attributeValues,
    commonDataError,
}: ContainerProps) => {
    const { programId, stageId, orgUnitId, teiId, enrollmentId } = useLocationQuery();

    const { navigate } = useNavigate();
    const dispatch = useDispatch();
    const { fromClientDate } = useTimeZoneConversion();
    const { serverVersion: { minor } } = useConfig();

    const handleCancel = useCallback(() => {
        navigate(`enrollment?${buildUrlQueryString({ programId, orgUnitId, teiId, enrollmentId })}`);
    }, [navigate, programId, orgUnitId, teiId, enrollmentId]);

    const onDeleteTrackedEntitySuccess = useCallback(() => {
        navigate(`/?${buildUrlQueryString({ orgUnitId, programId })}`);
    }, [navigate, orgUnitId, programId]);

    const onBackToMainPage = useCallback(() => {
        navigate(`/?${buildUrlQueryString({ orgUnitId, programId })}`);
    }, [navigate, orgUnitId, programId]);

    const onUpdateEnrollmentStatus = useCallback((enrollmentToUpdate) => {
        dispatch(updateEnrollmentAndEvents(enrollmentToUpdate));
    }, [dispatch]);

    const onUpdateEnrollmentStatusError = useCallback((message) => {
        dispatch(rollbackEnrollmentAndEvents());
        dispatch(showEnrollmentError({ message }));
    }, [dispatch]);

    const onUpdateEnrollmentStatusSuccess = useCallback(({ redirect }) => {
        dispatch(commitEnrollmentAndEvents());
        redirect && navigate(`enrollment?${buildUrlQueryString({ programId, orgUnitId, teiId, enrollmentId })}`);
    }, [dispatch, navigate, programId, orgUnitId, teiId, enrollmentId]);

    const handleSave = useCallback(
        ({ enrollments, events, linkMode }) => {
            if (linkMode && linkMode === RelatedStageModes.ENTER_DATA) return;

            const nowClient = fromClientDate(new Date());
            const nowServer = new Date(nowClient.getServerZonedISOString());
            const updatedAt = moment(nowServer).format('YYYY-MM-DDTHH:mm:ss');

            const eventsWithUpdatedDate = events.map(event => ({
                ...convertEventAttributeOptions(event, minor),
                updatedAt,
            }));

            if (enrollments) {
                dispatch(setExternalEnrollmentStatus(enrollments[0].status));
                dispatch(updateEnrollmentAndEvents(enrollments[0]));
            } else if (events) {
                dispatch(updateOrAddEnrollmentEvents({ events: eventsWithUpdatedDate }));
            }

            navigate(`enrollment?${buildUrlQueryString({ programId, orgUnitId, teiId, enrollmentId })}`);
        },
        [fromClientDate, navigate, programId, orgUnitId, teiId, enrollmentId, minor, dispatch],
    );

    const handleAddNew = useCallback(() => {
        navigate(`/new?${buildUrlQueryString({ programId, orgUnitId, teiId })}`);
    }, [navigate, programId, orgUnitId, teiId]);

    const handleDelete = useCallback(() => {
        dispatch(deleteEnrollment({ enrollmentId }));
        navigate(`enrollment?${buildUrlQueryString({ programId, orgUnitId, teiId })}`);
    }, [dispatch, enrollmentId, navigate, programId, orgUnitId, teiId]);
    const onEnrollmentError = message => dispatch(showEnrollmentError({ message }));
    const onEnrollmentSuccess = () => dispatch(fetchEnrollments());

    const onAccessLostFromTransfer = () => {
        navigate(`/?${buildUrlQueryString({ orgUnitId, programId })}`);
    };

    const widgetReducerName = 'enrollmentEvent-newEvent';

    const dataEntryHasChanges = useSelector(state => getDataEntryHasChanges(state, widgetReducerName));
    const { program } = useProgramInfo(programId);
    const selectedProgramStage = [...program?.stages.values() ?? []].find(item => item.id === stageId);
    const outputEffects = useWidgetDataFromStore(widgetReducerName);
    const hideWidgets = useHideWidgetByRuleLocations(program?.programRules.concat(selectedProgramStage?.programRules ?? []));
    // $FlowFixMe
    const trackedEntityName = program?.trackedEntityType?.name ?? '';

    const rulesExecutionDependencies = useMemo(() => ({
        events: enrollment?.events,
        attributeValues,
        enrollmentData: {
            enrolledAt: enrollment?.enrolledAt,
            occurredAt: enrollment?.occurredAt,
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
                stageIcon={selectedProgramStage?.icon}
                eventDateLabel={selectedProgramStage?.stageForm.getLabel('occurredAt')}
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
                pageLayout={pageLayout}
                availableWidgets={WidgetsForEnrollmentEventNew}
                program={program}
                stageId={stageId}
                orgUnitId={orgUnitId}
                teiId={teiId}
                enrollmentId={enrollmentId}
                onBackToMainPage={onBackToMainPage}
                onBackToDashboard={handleCancel}
                trackedEntityName={trackedEntityName}
                userInteractionInProgress={userInteractionInProgress}
                onSave={handleSave}
                onCancel={handleCancel}
                onDelete={handleDelete}
                onDeleteTrackedEntitySuccess={onDeleteTrackedEntitySuccess}
                onAddNew={handleAddNew}
                widgetEffects={outputEffects}
                hideWidgets={hideWidgets}
                widgetReducerName={widgetReducerName}
                pageFailure={commonDataError}
                rulesExecutionDependencies={rulesExecutionDependencies}
                dataEntryHasChanges={dataEntryHasChanges}
                ready={Boolean(enrollment)}
                onEnrollmentError={onEnrollmentError}
                onEnrollmentSuccess={onEnrollmentSuccess}
                events={enrollment?.events}
                onUpdateEnrollmentStatusSuccess={onUpdateEnrollmentStatusSuccess}
                onUpdateEnrollmentStatus={onUpdateEnrollmentStatus}
                onUpdateEnrollmentStatusError={onUpdateEnrollmentStatusError}
                onAccessLostFromTransfer={onAccessLostFromTransfer}
            />
        </>
    );
};
