// @flow
import React, { useCallback } from 'react';
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
// $FlowFixMe
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
    useCommonEnrollmentDomainData,
    useRuleEffects,
    updateEnrollmentAttributeValues,
    updateEnrollmentDate,
    updateIncidentDate,
    showEnrollmentError,
    updateEnrollmentAndEvents,
    commitEnrollmentAndEvents,
    rollbackEnrollmentAndEvents,
    removeExternalEnrollmentStatus,
} from '../../common/EnrollmentOverviewDomain';
import {
    updateEnrollmentDate as updateTopBarEnrollmentDate,
    deleteEnrollment,
    updateTeiDisplayName,
} from '../EnrollmentPage.actions';
import { useTrackerProgram } from '../../../../hooks/useTrackerProgram';
import { useCoreOrgUnit } from '../../../../metadataRetrieval/coreOrgUnit';
import { EnrollmentPageDefaultComponent } from './EnrollmentPageDefault.component';
import {
    useProgramMetadata,
    useHideWidgetByRuleLocations,
    useProgramStages,
} from './hooks';
import { buildUrlQueryString, useLocationQuery } from '../../../../utils/routing';
import { useFilteredWidgetData } from './hooks/useFilteredWidgetData';
import { useLinkedRecordClick } from '../../common/TEIRelationshipsWidget';

export const EnrollmentPageDefault = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { status: widgetEnrollmentStatus } = useSelector(({ widgetEnrollment }) => widgetEnrollment);
    const { enrollmentId, programId, teiId, orgUnitId } = useLocationQuery();
    const { orgUnit, error } = useCoreOrgUnit(orgUnitId);
    const { onLinkedRecordClick } = useLinkedRecordClick();

    const program = useTrackerProgram(programId);
    const {
        error: enrollmentsError,
        enrollment,
        attributeValues,
    } = useCommonEnrollmentDomainData(teiId, enrollmentId, programId);
    const { error: programMetaDataError, programMetadata } = useProgramMetadata(programId);
    const stages = useProgramStages(program, programMetadata?.programStages);

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

    const onDelete = () => {
        history.push(`/enrollment?${buildUrlQueryString({ orgUnitId, programId, teiId })}`);
        dispatch(deleteEnrollment({ enrollmentId }));
    };

    const onViewAll = (stageId) => {
        history.push(
            `/enrollment/stageEvents?${buildUrlQueryString({ orgUnitId, programId, stageId })}`);
    };

    const onCreateNew = (stageId) => {
        history.push(
            `/enrollmentEventNew?${buildUrlQueryString({ orgUnitId, programId, teiId, enrollmentId, stageId })}`,
        );
    };

    const onEventClick = (eventId: string) => {
        history.push(`/enrollmentEventEdit?${buildUrlQueryString({ orgUnitId, eventId })}`);
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

    const onAddNew = () => {
        history.push(`/new?${buildUrlQueryString({ orgUnitId, programId, teiId })}`);
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
        dispatch(removeExternalEnrollmentStatus());
        dispatch(commitEnrollmentAndEvents());
    }, [dispatch]);

    if (error) {
        return error.errorComponent;
    }

    return (
        <EnrollmentPageDefaultComponent
            teiId={teiId}
            orgUnitId={orgUnitId}
            program={program}
            // $FlowFixMe
            stages={stages}
            events={enrollment?.events}
            enrollmentId={enrollmentId}
            onAddNew={onAddNew}
            onDelete={onDelete}
            onViewAll={onViewAll}
            onCreateNew={onCreateNew}
            widgetEffects={outputEffects}
            hideWidgets={hideWidgets}
            onEventClick={onEventClick}
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
        />
    );
};
