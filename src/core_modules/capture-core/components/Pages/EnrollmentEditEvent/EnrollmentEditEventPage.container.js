// @flow
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { dataEntryIds } from 'capture-core/constants';
import { useEnrollmentEditEventPageMode } from 'capture-core/hooks';
import { useCommonEnrollmentDomainData, showEnrollmentError, updateEnrollmentEvent } from '../common/EnrollmentOverviewDomain';
import { useTeiDisplayName } from '../common/EnrollmentOverviewDomain/useTeiDisplayName';
import { useProgramInfo } from '../../../hooks/useProgramInfo';
import { pageStatuses } from './EnrollmentEditEventPage.constants';
import { EnrollmentEditEventPageComponent } from './EnrollmentEditEventPage.component';
import { useWidgetDataFromStore } from '../EnrollmentAddEvent/hooks';
import { useHideWidgetByRuleLocations } from '../Enrollment/EnrollmentPageDefault/hooks';
import { buildUrlQueryString, useLocationQuery } from '../../../utils/routing';
import { deleteEnrollment, fetchEnrollments } from '../Enrollment/EnrollmentPage.actions';
import { changeEventFromUrl } from '../ViewEvent/ViewEventComponent/viewEvent.actions';
import { buildEnrollmentsAsOptions } from '../../ScopeSelector';
import { convertDateWithTimeForView, convertValue } from '../../../converters/clientToView';
import { dataElementTypes } from '../../../metaData/DataElement';
import { useEvent } from './hooks';
import type { Props } from './EnrollmentEditEventPage.types';
import { LoadingMaskForPage } from '../../LoadingMasks';
import { cleanUpDataEntry } from '../../DataEntry';
import { pageKeys } from '../../App/withAppUrlSync';
import { withErrorMessageHandler } from '../../../HOC';

const getEventDate = (event) => {
    const eventDataConvertValue = convertDateWithTimeForView(event?.occurredAt || event?.scheduledAt);
    const eventDate = eventDataConvertValue ? eventDataConvertValue.toString() : '';
    return eventDate;
};

const getEventScheduleDate = (event) => {
    if (!event?.scheduledAt) { return undefined; }
    const eventDataConvertValue = convertValue(event?.scheduledAt, dataElementTypes.DATETIME);
    return eventDataConvertValue?.toString();
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
    const history = useHistory();
    const dispatch = useDispatch();

    const eventId = useSelector(({ viewEventPage }) => viewEventPage.eventId);
    const error = useSelector(({ activePage }) => activePage.viewEventLoadError?.error);
    const { loading, event } = useEvent(eventId);
    const { program: programId, programStage: stageId, trackedEntity: teiId, enrollment: enrollmentId } = event;
    const { orgUnitId, eventId: urlEventId } = useLocationQuery();

    useEffect(() => {
        if (!urlEventId) {
            // return to main page
            history.push(`/?${buildUrlQueryString({ orgUnitId })}`);
        } else if (eventId !== urlEventId) {
            dispatch(changeEventFromUrl(urlEventId, pageKeys.ENROLLMENT_EVENT));
        }
    }, [dispatch, history, eventId, urlEventId, orgUnitId]);

    return (!loading && eventId === urlEventId) || error ? (
        <EnrollmentEditEventPageWithContext
            programId={programId}
            stageId={stageId}
            teiId={teiId}
            enrollmentId={enrollmentId}
            orgUnitId={orgUnitId}
            eventId={eventId}
            error={error}
        />
    ) : <LoadingMaskForPage />;
};

const EnrollmentEditEventPageWithContextPlain = ({ programId, stageId, teiId, enrollmentId, orgUnitId, eventId }: Props) => {
    const history = useHistory();
    const dispatch = useDispatch();

    useEffect(() => () => {
        dispatch(cleanUpDataEntry(dataEntryIds.ENROLLMENT_EVENT));
    }, [dispatch]);

    const { program } = useProgramInfo(programId);
    const programStage = [...program.stages?.values()].find(item => item.id === stageId);
    const hideWidgets = useHideWidgetByRuleLocations(program.programRules.concat(programStage?.programRules));

    const onDelete = () => {
        history.push(`/enrollment?${buildUrlQueryString({ orgUnitId, programId, teiId })}`);
        dispatch(deleteEnrollment({ enrollmentId }));
    };
    const onEnrollmentError = message => dispatch(showEnrollmentError({ message }));
    const onEnrollmentSuccess = () => dispatch(fetchEnrollments());
    const onAddNew = () => {
        history.push(`/new?${buildUrlQueryString({ programId, orgUnitId, teiId })}`);
    };
    const onCancelEditEvent = () => {
        history.push(`/enrollment?${buildUrlQueryString({ enrollmentId })}`);
    };

    const onGoBack = () =>
        history.push(`/enrollment?${buildUrlQueryString({ enrollmentId })}`);

    const onHandleScheduleSave = (eventData: Object) => {
        dispatch(updateEnrollmentEvent(eventId, eventData));
        history.push(`enrollment?${buildUrlQueryString({ enrollmentId })}`);
    };
    const enrollmentSite = useCommonEnrollmentDomainData(teiId, enrollmentId, programId).enrollment;
    const { teiDisplayName } = useTeiDisplayName(teiId, programId);
    // $FlowFixMe
    const trackedEntityName = program?.trackedEntityType?.name;
    const enrollmentsAsOptions = buildEnrollmentsAsOptions([enrollmentSite || {}], programId);
    const event = enrollmentSite?.events?.find(item => item.event === eventId);
    const eventDate = getEventDate(event);
    const scheduleDate = getEventScheduleDate(event);
    const { currentPageMode } = useEnrollmentEditEventPageMode(event?.status);
    const dataEntryKey = `${dataEntryIds.ENROLLMENT_EVENT}-${currentPageMode}`;
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
            onEnrollmentSuccess={onEnrollmentSuccess}
            eventStatus={event?.status}
            scheduleDate={scheduleDate}
            onCancelEditEvent={onCancelEditEvent}
            onHandleScheduleSave={onHandleScheduleSave}
        />
    );
};

const EnrollmentEditEventPageWithContext = withErrorMessageHandler()(EnrollmentEditEventPageWithContextPlain);
