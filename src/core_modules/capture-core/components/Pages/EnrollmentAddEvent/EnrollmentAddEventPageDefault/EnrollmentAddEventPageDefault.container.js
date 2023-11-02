// @flow
import React, { useCallback, useMemo } from 'react';
import moment from 'moment';
// $FlowFixMe
import { useDispatch, useSelector } from 'react-redux';
import { useTimeZoneConversion } from '@dhis2/app-runtime';
import i18n from '@dhis2/d2-i18n';
import { useHistory } from 'react-router-dom';
import { NoticeBox } from '@dhis2/ui';
import { buildUrlQueryString, useLocationQuery } from '../../../../utils/routing';
import { useProgramInfo } from '../../../../hooks/useProgramInfo';
import { useEnrollmentAddEventTopBar, EnrollmentAddEventTopBar } from '../TopBar';
import { EnrollmentAddEventPageDefaultComponent } from './EnrollmentAddEventPageDefault.component';
import { deleteEnrollment, fetchEnrollments } from '../../Enrollment/EnrollmentPage.actions';
import { actions as ReferralModes } from '../../../WidgetReferral/constants';

import { useWidgetDataFromStore } from '../hooks';
import {
    useHideWidgetByRuleLocations,
} from '../../Enrollment/EnrollmentPageDefault/hooks';
import { addEnrollmentEvents, showEnrollmentError } from '../../common/EnrollmentOverviewDomain';
import { dataEntryHasChanges as getDataEntryHasChanges } from '../../../DataEntry/common/dataEntryHasChanges';
import type { ContainerProps } from './EnrollmentAddEventPageDefault.types';
import { convertEventAttributeOptions } from '../../../../events/convertEventAttributeOptions';

export const EnrollmentAddEventPageDefault = ({
    enrollment,
    attributeValues,
    commonDataError,
}: ContainerProps) => {
    const { programId, stageId, orgUnitId, teiId, enrollmentId } = useLocationQuery();

    const history = useHistory();
    const dispatch = useDispatch();
    const { fromClientDate } = useTimeZoneConversion();

    const handleCancel = useCallback(() => {
        history.push(`enrollment?${buildUrlQueryString({ programId, orgUnitId, teiId, enrollmentId })}`);
    }, [history, programId, orgUnitId, teiId, enrollmentId]);

    const handleSave = useCallback(
        ({ events, referralMode }) => {
            if (referralMode && referralMode === ReferralModes.ENTER_DATA) return;

            const nowClient = fromClientDate(new Date());
            const nowServer = new Date(nowClient.getServerZonedISOString());
            const updatedAt = moment(nowServer).format('YYYY-MM-DDTHH:mm:ss');

            const eventsWithUpdatedDate = events.map(event => ({
                ...convertEventAttributeOptions(event),
                updatedAt,
            }));

            dispatch(addEnrollmentEvents({ events: eventsWithUpdatedDate }));
            history.push(`enrollment?${buildUrlQueryString({ programId, orgUnitId, teiId, enrollmentId })}`);
        },
        [fromClientDate, dispatch, history, programId, orgUnitId, teiId, enrollmentId],
    );
    const handleAddNew = useCallback(() => {
        history.push(`/new?${buildUrlQueryString({ programId, orgUnitId, teiId })}`);
    }, [history, programId, orgUnitId, teiId]);

    const handleDelete = useCallback(() => {
        dispatch(deleteEnrollment({ enrollmentId }));
        history.push(`enrollment?${buildUrlQueryString({ programId, orgUnitId, teiId })}`);
    }, [dispatch, enrollmentId, history, programId, orgUnitId, teiId]);
    const onEnrollmentError = message => dispatch(showEnrollmentError({ message }));
    const onEnrollmentSuccess = () => dispatch(fetchEnrollments());

    const widgetReducerName = 'enrollmentEvent-newEvent';

    const dataEntryHasChanges = useSelector(state => getDataEntryHasChanges(state, widgetReducerName));
    const { program } = useProgramInfo(programId);
    const selectedProgramStage = [...program.stages.values()].find(item => item.id === stageId);
    const outputEffects = useWidgetDataFromStore(widgetReducerName);
    const hideWidgets = useHideWidgetByRuleLocations(program.programRules.concat(selectedProgramStage?.programRules ?? []));
    // $FlowFixMe
    const trackedEntityName = program?.trackedEntityType?.name;

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
                programId={programId}
                stageId={stageId}
                orgUnitId={orgUnitId}
                teiId={teiId}
                enrollmentId={enrollmentId}
                onSave={handleSave}
                onCancel={handleCancel}
                onDelete={handleDelete}
                onAddNew={handleAddNew}
                widgetEffects={outputEffects}
                hideWidgets={hideWidgets}
                widgetReducerName={widgetReducerName}
                rulesExecutionDependencies={rulesExecutionDependencies}
                pageFailure={commonDataError}
                ready={Boolean(enrollment)}
                dataEntryHasChanges={dataEntryHasChanges}
                onEnrollmentError={onEnrollmentError}
                onEnrollmentSuccess={onEnrollmentSuccess}
            />
        </>
    );
};
