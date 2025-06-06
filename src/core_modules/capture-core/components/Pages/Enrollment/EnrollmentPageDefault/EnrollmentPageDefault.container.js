// @flow
import React, { useCallback } from 'react';
import i18n from '@dhis2/d2-i18n';
import moment from 'moment';
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { useDispatch, useSelector } from 'react-redux';
import { useTimeZoneConversion } from '@dhis2/app-runtime';
import {
    commitEnrollmentAndEvents,
    rollbackEnrollmentAndEvents,
    showEnrollmentError,
    updateEnrollmentAndEvents,
    updateEnrollmentAttributeValues,
    updateEnrollmentDate,
    updateIncidentDate,
    useCommonEnrollmentDomainData,
    useRuleEffects,
} from '../../common/EnrollmentOverviewDomain';
import {
    deleteEnrollment,
    updateEnrollmentDate as updateTopBarEnrollmentDate,
    updateTeiDisplayName,
} from '../EnrollmentPage.actions';
import { useTrackerProgram } from '../../../../hooks/useTrackerProgram';
import { useCoreOrgUnit } from '../../../../metadataRetrieval/coreOrgUnit';
import { DataStoreKeyByPage, EnrollmentPageLayout } from '../../common/EnrollmentOverviewDomain/EnrollmentPageLayout';
import { useHideWidgetByRuleLocations, useProgramMetadata, useProgramStages } from './hooks';
import { useNavigate, buildUrlQueryString, useLocationQuery } from '../../../../utils/routing';
import { useFilteredWidgetData } from './hooks/useFilteredWidgetData';
import { useLinkedRecordClick } from '../../common/TEIRelationshipsWidget';
import {
    useEnrollmentPageLayout,
} from '../../common/EnrollmentOverviewDomain/EnrollmentPageLayout/hooks/useEnrollmentPageLayout';
import { DefaultPageLayout, WidgetsForEnrollmentPageDefault } from './DefaultPageLayout';
import { LoadingMaskForPage } from '../../../LoadingMasks';
import {
    EnrollmentPageKeys,
} from '../../common/EnrollmentOverviewDomain/EnrollmentPageLayout/DefaultEnrollmentLayout.constants';
import {
    addPersistedEnrollmentEvents,
    deleteEnrollmentEvent,
    updateEnrollmentEventStatus,
} from '../../common/EnrollmentOverviewDomain/enrollment.actions';


export const EnrollmentPageDefault = () => {
    const { navigate } = useNavigate();
    const dispatch = useDispatch();
    const { fromClientDate } = useTimeZoneConversion();
    const { status: widgetEnrollmentStatus } = useSelector(({ widgetEnrollment }) => widgetEnrollment);
    const { enrollmentId, programId, teiId, orgUnitId } = useLocationQuery();
    const { orgUnit, error } = useCoreOrgUnit(orgUnitId);
    const { onLinkedRecordClick } = useLinkedRecordClick();
    const {
        pageLayout,
        isLoading,
    } = useEnrollmentPageLayout({
        selectedScopeId: programId,
        defaultPageLayout: DefaultPageLayout,
        dataStoreKey: DataStoreKeyByPage.ENROLLMENT_OVERVIEW,
    });

    const program = useTrackerProgram(programId);
    const {
        error: enrollmentsError,
        enrollment,
        attributeValues,
    } = useCommonEnrollmentDomainData(teiId, enrollmentId, programId);
    const { error: programMetaDataError, programMetadata } = useProgramMetadata(programId);
    const stages = useProgramStages(program, programMetadata?.programStages);
    /*
        regarding useTrackerProgram, useProgramMetadata, useProgramStages
        We should refactor this to only grab metadata from IndexedDB and build the appropriate data structures
        needed. At the moment it is a bit chaotic and confusing because some of the metadata is retrieved from the in-memory objects
        (these objects remain in memory for the entire session, consuming a lot of memory and we don't want to add additional
        data here) and some is grabbed from IndexedDB.
        https://dhis2.atlassian.net/browse/DHIS2-17574
    */

    if (programMetaDataError || enrollmentsError) {
        log.error(errorCreator('Enrollment page could not be loaded')(
            { programMetaDataError, enrollmentsError },
        ));
    }

    const ruleEffects = useRuleEffects({
        orgUnit,
        program,
        apiEnrollment: enrollment,
        apiAttributeValues: attributeValues,
    });

    // $FlowFixMe
    const outputEffects = useFilteredWidgetData(ruleEffects);
    const hideWidgets = useHideWidgetByRuleLocations(program.programRules);

    const onDeleteTrackedEntitySuccess = useCallback(() => {
        navigate(`/?${buildUrlQueryString({ orgUnitId, programId })}`);
    }, [navigate, orgUnitId, programId]);

    const onDelete = () => {
        navigate(`/enrollment?${buildUrlQueryString({ orgUnitId, programId, teiId })}`);
        dispatch(deleteEnrollment({ enrollmentId }));
    };

    const onViewAll = (stageId) => {
        navigate(
            `/enrollment/stageEvents?${buildUrlQueryString({ orgUnitId, programId, stageId })}`);
    };

    const onCreateNew = (stageId) => {
        navigate(
            `/enrollmentEventNew?${buildUrlQueryString({ orgUnitId, programId, teiId, enrollmentId, stageId })}`,
        );
    };

    const onEventClick = (eventId: string) => {
        navigate(`/enrollmentEventEdit?${buildUrlQueryString({ orgUnitId, eventId })}`);
    };

    const onUpdateTeiAttributeValues = useCallback((updatedAttributeValues, teiDisplayName) => {
        dispatch(updateEnrollmentAttributeValues(updatedAttributeValues
            .map(({ attribute, value }) => ({ id: attribute, value })),
        ));
        dispatch(updateTeiDisplayName(teiDisplayName));
    }, [dispatch]);

    const onUpdateEnrollmentDate = useCallback((enrollmentDate) => {
        dispatch(updateEnrollmentDate(enrollmentDate));
        dispatch(updateTopBarEnrollmentDate({ enrollmentId, enrollmentDate }));
    }, [dispatch, enrollmentId]);

    const onUpdateIncidentDate = useCallback((incidentDate) => {
        dispatch(updateIncidentDate(incidentDate));
    }, [dispatch]);

    const onDeleteEvent = useCallback((eventId: string) => {
        dispatch(deleteEnrollmentEvent(eventId));
    }, [dispatch]);

    const onRollbackDeleteEvent = useCallback((eventDetails: ApiEnrollmentEvent) => {
        dispatch(addPersistedEnrollmentEvents({ events: [eventDetails] }));
    }, [dispatch]);

    const onUpdateEventStatus = useCallback((eventId: string, status: string) => {
        const nowClient = fromClientDate(new Date());
        const nowServer = new Date(nowClient.getServerZonedISOString());
        const updatedAt = moment(nowServer).locale('en').format('YYYY-MM-DDTHH:mm:ss');

        dispatch(updateEnrollmentEventStatus(eventId, status, updatedAt));
    }, [dispatch, fromClientDate]);

    const onAddNew = () => {
        navigate(`/new?${buildUrlQueryString({ orgUnitId, programId, teiId })}`);
    };

    const onAccessLostFromTransfer = () => {
        navigate(`/?${buildUrlQueryString({ orgUnitId, programId })}`);
    };

    const onEnrollmentError = message => dispatch(showEnrollmentError({ message }));
    const onUpdateEnrollmentStatus = useCallback(
        (enrollmentToUpdate: Object) => dispatch(updateEnrollmentAndEvents(enrollmentToUpdate)),
        [dispatch],
    );
    const onUpdateEnrollmentStatusError = useCallback(
        (message) => {
            dispatch(rollbackEnrollmentAndEvents());
            dispatch(showEnrollmentError({ message }));
        },
        [dispatch],
    );
    const onUpdateEnrollmentStatusSuccess = useCallback(() => {
        dispatch(commitEnrollmentAndEvents());
    }, [dispatch]);

    const onBackToMainPage = useCallback(() => {
        navigate(`/?${buildUrlQueryString({ orgUnitId, programId })}`);
    }, [navigate, orgUnitId, programId]);

    if (isLoading) {
        return (
            <LoadingMaskForPage />
        );
    }

    if (error) {
        return error?.errorComponent;
    }

    return (
        <EnrollmentPageLayout
            pageLayout={pageLayout}
            currentPage={EnrollmentPageKeys.OVERVIEW}
            availableWidgets={WidgetsForEnrollmentPageDefault}

            teiId={teiId}
            orgUnitId={orgUnitId}
            program={program}
            // $FlowFixMe
            stages={stages}
            events={enrollment?.events}
            enrollmentId={enrollmentId}
            onAddNew={onAddNew}
            onDelete={onDelete}
            onDeleteTrackedEntitySuccess={onDeleteTrackedEntitySuccess}
            onViewAll={onViewAll}
            onBackToMainPage={onBackToMainPage}
            onCreateNew={onCreateNew}
            widgetEffects={outputEffects}
            hideWidgets={hideWidgets}
            onEventClick={onEventClick}
            onDeleteEvent={onDeleteEvent}
            onUpdateEventStatus={onUpdateEventStatus}
            onRollbackDeleteEvent={onRollbackDeleteEvent}
            onLinkedRecordClick={onLinkedRecordClick}
            onUpdateTeiAttributeValues={onUpdateTeiAttributeValues}
            onUpdateEnrollmentDate={onUpdateEnrollmentDate}
            onUpdateIncidentDate={onUpdateIncidentDate}
            onEnrollmentError={onEnrollmentError}
            onUpdateEnrollmentStatus={onUpdateEnrollmentStatus}
            onUpdateEnrollmentStatusSuccess={onUpdateEnrollmentStatusSuccess}
            onUpdateEnrollmentStatusError={onUpdateEnrollmentStatusError}
            ruleEffects={ruleEffects}
            widgetEnrollmentStatus={widgetEnrollmentStatus}
            onAccessLostFromTransfer={onAccessLostFromTransfer}
            feedbackEmptyText={i18n.t('No feedback for this enrollment yet')}
            indicatorEmptyText={i18n.t('No indicator output for this enrollment yet')}
        />
    );
};
