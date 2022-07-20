// @flow
import React from 'react';
// $FlowFixMe
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useEnrollmentEditEventPageMode } from 'capture-core/hooks';
import { useCommonEnrollmentDomainData } from '../common/EnrollmentOverviewDomain';
import { useTeiDisplayName } from '../common/EnrollmentOverviewDomain/useTeiDisplayName';
import { useProgramInfo } from '../../../hooks/useProgramInfo';
import { useEventsRelationships } from './useEventsRelationships';
import { pageStatuses } from './EnrollmentEditEventPage.constants';
import { EnrollmentEditEventPageComponent } from './EnrollmentEditEventPage.component';
import { useWidgetDataFromStore } from '../EnrollmentAddEvent/hooks';
import { useHideWidgetByRuleLocations } from '../Enrollment/EnrollmentPageDefault/hooks';
import { buildUrlQueryString, useLocationQuery } from '../../../utils/routing';
import { clickLinkedRecord, deleteEnrollment } from '../Enrollment/EnrollmentPage.actions';
import { buildEnrollmentsAsOptions } from '../../ScopeSelector';
import { convertValue } from '../../../converters/clientToView';
import { dataElementTypes } from '../../../metaData/DataElement';
import { useRelationshipTypesMetadata } from '../common/EnrollmentOverviewDomain/useRelationshipTypesMetadata';

export const EnrollmentEditEventPage = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { programId, stageId, teiId, enrollmentId, orgUnitId, eventId } = useLocationQuery();
    const { program } = useProgramInfo(programId);
    const programStage = [...program.stages?.values()].find(item => item.id === stageId);
    const hideWidgets = useHideWidgetByRuleLocations(program.programRules.concat(programStage?.programRules));

    const onDelete = () => {
        history.push(`/enrollment?${buildUrlQueryString({ orgUnitId, programId, teiId })}`);
        dispatch(deleteEnrollment({ enrollmentId }));
    };
    const onAddNew = () => {
        history.push(`/new?${buildUrlQueryString({ programId, orgUnitId, teiId })}`);
    };
    const onCancel = () => {
        history.push(`/enrollment?${buildUrlQueryString({ enrollmentId })}`);
    };

    const onLinkedRecordClick = (parameters) => {
        dispatch(clickLinkedRecord(parameters));
    };

    const onGoBack = () => history.push(`/enrollment?${buildUrlQueryString({ orgUnitId, programId, teiId, enrollmentId })}`);
    const { enrollment: enrollmentSite, relationships } = useCommonEnrollmentDomainData(teiId, enrollmentId, programId);
    const { teiDisplayName } = useTeiDisplayName(teiId, programId);
    // $FlowFixMe
    const trackedEntityName = program?.trackedEntityType?.name;
    const enrollmentsAsOptions = buildEnrollmentsAsOptions([enrollmentSite || {}], programId);
    const event = enrollmentSite?.events?.find(item => item.event === eventId);
    const eventDataConvertValue = convertValue((event?.occurredAt || event?.scheduledAt), dataElementTypes.DATETIME);
    const eventDate = eventDataConvertValue ? eventDataConvertValue.toString() : '';
    const { currentPageMode, cancel } = useEnrollmentEditEventPageMode(event?.status);
    cancel && onCancel();
    const dataEntryKey = `singleEvent-${currentPageMode}`;
    const outputEffects = useWidgetDataFromStore(dataEntryKey);

    let pageStatus = pageStatuses.MISSING_DATA;
    if (orgUnitId) {
        enrollmentSite && teiDisplayName && trackedEntityName && programStage && event
            ? (pageStatus = pageStatuses.DEFAULT)
            : (pageStatus = pageStatuses.MISSING_DATA);
    } else pageStatus = pageStatuses.WITHOUT_ORG_UNIT_SELECTED;
    const { relationships: eventRelationships } = useEventsRelationships(eventId);
    const teiRelationshipTypes = useRelationshipTypesMetadata(relationships);
    const eventRelationshipTypes = useRelationshipTypesMetadata(eventRelationships);

    return (
        <EnrollmentEditEventPageComponent
            mode={currentPageMode}
            pageStatus={pageStatus}
            programStage={programStage}
            onGoBack={onGoBack}
            widgetEffects={outputEffects}
            hideWidgets={hideWidgets}
            relationships={relationships}
            eventRelationships={eventRelationships}
            teiRelationshipTypes={teiRelationshipTypes}
            eventRelationshipTypes={eventRelationshipTypes}
            teiId={teiId}
            eventId={eventId}
            enrollmentId={enrollmentId}
            enrollmentsAsOptions={enrollmentsAsOptions}
            teiDisplayName={teiDisplayName}
            trackedEntityName={trackedEntityName}
            programId={programId}
            onDelete={onDelete}
            onAddNew={onAddNew}
            orgUnitId={orgUnitId}
            eventDate={eventDate}
            onLinkedRecordClick={onLinkedRecordClick}
            eventStatus={event?.status}
        />
    );
};
