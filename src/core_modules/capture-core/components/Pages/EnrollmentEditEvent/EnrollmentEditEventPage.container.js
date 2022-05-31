// @flow
import React, { useState, useEffect } from 'react';
// $FlowFixMe
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useCommonEnrollmentDomainData } from '../common/EnrollmentOverviewDomain';
import { useTeiDisplayName } from '../common/EnrollmentOverviewDomain/useTeiDisplayName';
import { useProgramInfo } from '../../../hooks/useProgramInfo';
import { pageMode, pageStatuses } from './EnrollmentEditEventPage.constants';
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
    let pageStatus = pageStatuses.MISSING_DATA;
    if (orgUnitId) {
        enrollmentSite && teiDisplayName && trackedEntityName && programStage && event
            ? (pageStatus = pageStatuses.DEFAULT)
            : (pageStatus = pageStatuses.MISSING_DATA);
    } else pageStatus = pageStatuses.WITHOUT_ORG_UNIT_SELECTED;
    return pageStatus;
};

export const EnrollmentEditEventPage = () => {
    const { orgUnitId, eventId } = useLocationQuery();
    const { event } = useEvent(eventId);
    const [context, setContext] = useState({});
    const { programId, stageId, teiId, enrollmentId } = context;

    useEffect(() => {
        event && setContext(prevContext => ({
            ...prevContext,
            programId: event.program,
            stageId: event.programStage,
            teiId: event.trackedEntity,
            enrollmentId: event.enrollment,
        }));
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
    const showEditEvent = useSelector(({ viewEventPage }) => viewEventPage?.eventDetailsSection?.showEditEvent);
    const programStage = [...program.stages?.values()].find(item => item.id === stageId);
    const currentPageMode = showEditEvent ? pageMode.EDIT : pageMode.VIEW;
    const dataEntryKey = `singleEvent-${currentPageMode}`;
    const outputEffects = useWidgetDataFromStore(dataEntryKey);
    const hideWidgets = useHideWidgetByRuleLocations(program.programRules);

    const onDelete = () => {
        history.push(`/enrollment?${buildUrlQueryString({ orgUnitId, programId, teiId })}`);
        dispatch(deleteEnrollment({ enrollmentId }));
    };
    const onAddNew = () => {
        history.push(`/new?${buildUrlQueryString({ programId, orgUnitId, teiId })}`);
    };

    const onGoBack = () =>
        history.push(`/enrollment?${buildUrlQueryString({ orgUnitId, programId, teiId, enrollmentId })}`);
    const enrollmentSite = useCommonEnrollmentDomainData(teiId, enrollmentId, programId).enrollment;
    const { teiDisplayName } = useTeiDisplayName(teiId, programId);
    // $FlowFixMe
    const trackedEntityName = program?.trackedEntityType?.name;
    const enrollmentsAsOptions = buildEnrollmentsAsOptions([enrollmentSite || {}], programId);
    const event = enrollmentSite?.events?.find(item => item.event === eventId);
    const eventDate = getEventDate(event);
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
        />
    );
};
