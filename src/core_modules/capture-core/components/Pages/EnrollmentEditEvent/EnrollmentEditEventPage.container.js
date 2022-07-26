// @flow
import React, { useState, useEffect } from 'react';
// $FlowFixMe
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useEnrollmentEditEventPageMode } from 'capture-core/hooks';
import { useCommonEnrollmentDomainData, showEnrollmentError } from '../common/EnrollmentOverviewDomain';
import { useTeiDisplayName } from '../common/EnrollmentOverviewDomain/useTeiDisplayName';
import { useProgramInfo } from '../../../hooks/useProgramInfo';
import { pageStatuses } from './EnrollmentEditEventPage.constants';
import { EnrollmentEditEventPageComponent } from './EnrollmentEditEventPage.component';
import { useWidgetDataFromStore } from '../EnrollmentAddEvent/hooks';
import { useHideWidgetByRuleLocations } from '../Enrollment/EnrollmentPageDefault/hooks';
import { buildUrlQueryString, useLocationQuery } from '../../../utils/routing';
import { deleteEnrollment } from '../Enrollment/EnrollmentPage.actions';
import { buildEnrollmentsAsOptions } from '../../ScopeSelector';
import { convertValue } from '../../../converters/clientToView';
import { dataElementTypes } from '../../../metaData/DataElement';
import { useEvent } from './hooks';
import type { Props } from './EnrollmentEditEventPage.types';
import { LoadingMaskForPage } from '../../LoadingMasks';

const getEventDate = (event) => {
    const eventDataConvertValue = convertValue(event?.occurredAt || event?.scheduledAt, dataElementTypes.DATETIME);
    const eventDate = eventDataConvertValue ? eventDataConvertValue.toString() : '';
    return eventDate;
};

const getPageStatus = ({ orgUnitId, enrollmentSite, teiDisplayName, trackedEntityName, programStage, event }) => {
    if (orgUnitId) {
        return enrollmentSite && teiDisplayName && trackedEntityName && programStage && event
            ? pageStatuses.DEFAULT
            : pageStatuses.MISSING_DATA;
    }
    return pageStatuses.WITHOUT_ORG_UNIT_SELECTED;
};

export const EnrollmentEditEventPage = () => {
    const { orgUnitId, eventId } = useLocationQuery();
    const { event } = useEvent(eventId);
    const [context, setContext] = useState({});
    const { programId, stageId, teiId, enrollmentId } = context;

    useEffect(() => {
        event && setContext({
            programId: event.program,
            stageId: event.programStage,
            teiId: event.trackedEntity,
            enrollmentId: event.enrollment,
        });
    }, [event]);

    return eventId && programId && stageId && enrollmentId && teiId ? (
        <EnrollmentEditEventPageWithContext
            programId={programId}
            stageId={stageId}
            teiId={teiId}
            enrollmentId={enrollmentId}
            orgUnitId={orgUnitId}
            eventId={eventId}

        />
    ) : <LoadingMaskForPage />;
};

const EnrollmentEditEventPageWithContext = ({ programId, stageId, teiId, enrollmentId, orgUnitId, eventId }: Props) => {
    const history = useHistory();
    const dispatch = useDispatch();

    const { program } = useProgramInfo(programId);
    const programStage = [...program.stages?.values()].find(item => item.id === stageId);
    const hideWidgets = useHideWidgetByRuleLocations(program.programRules.concat(programStage?.programRules));

    const onDelete = () => {
        history.push(`/enrollment?${buildUrlQueryString({ orgUnitId, programId, teiId })}`);
        dispatch(deleteEnrollment({ enrollmentId }));
    };
    const onEnrollmentError = message => dispatch(showEnrollmentError({ message }));
    const onAddNew = () => {
        history.push(`/new?${buildUrlQueryString({ programId, orgUnitId, teiId })}`);
    };
    const onCancel = () => {
        history.push(`/enrollment?${buildUrlQueryString({ enrollmentId })}`);
    };

    const onGoBack = () =>
        history.push(`/enrollment?${buildUrlQueryString({ enrollmentId })}`);
    const enrollmentSite = useCommonEnrollmentDomainData(teiId, enrollmentId, programId).enrollment;
    const { teiDisplayName } = useTeiDisplayName(teiId, programId);
    // $FlowFixMe
    const trackedEntityName = program?.trackedEntityType?.name;
    const enrollmentsAsOptions = buildEnrollmentsAsOptions([enrollmentSite || {}], programId);
    const event = enrollmentSite?.events?.find(item => item.event === eventId);
    const eventDate = getEventDate(event);
    const { currentPageMode, cancel } = useEnrollmentEditEventPageMode(event?.status);
    cancel && onCancel();
    const dataEntryKey = `singleEvent-${currentPageMode}`;
    const outputEffects = useWidgetDataFromStore(dataEntryKey);

    const pageStatus = getPageStatus({
        orgUnitId,
        enrollmentSite,
        teiDisplayName,
        trackedEntityName,
        programStage,
        event,
    });

    return (
        <EnrollmentEditEventPageComponent
            mode={currentPageMode}
            pageStatus={pageStatus}
            programStage={programStage}
            onGoBack={onGoBack}
            widgetEffects={outputEffects}
            hideWidgets={hideWidgets}
            teiId={teiId}
            enrollmentId={enrollmentId}
            enrollmentsAsOptions={enrollmentsAsOptions}
            teiDisplayName={teiDisplayName}
            trackedEntityName={trackedEntityName}
            programId={programId}
            onDelete={onDelete}
            onAddNew={onAddNew}
            orgUnitId={orgUnitId}
            eventDate={eventDate}
            onEnrollmentError={onEnrollmentError}
            eventStatus={event?.status}
        />
    );
};
