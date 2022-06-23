// @flow
import React from 'react';
// $FlowFixMe
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useCommonEnrollmentDomainData, showEnrollmentError } from '../common/EnrollmentOverviewDomain';
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

export const EnrollmentEditEventPage = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { programId, stageId, teiId, enrollmentId, orgUnitId, eventId } = useLocationQuery();
    const { program } = useProgramInfo(programId);
    const showEditEvent = useSelector(({ viewEventPage }) => viewEventPage?.eventDetailsSection?.showEditEvent);
    const programStage = [...program.stages?.values()].find(item => item.id === stageId);
    const currentPageMode = showEditEvent ? pageMode.EDIT : pageMode.VIEW;
    const dataEntryKey = `singleEvent-${currentPageMode}`;
    const outputEffects = useWidgetDataFromStore(dataEntryKey);
    const hideWidgets = useHideWidgetByRuleLocations(program.programRules.concat(programStage?.programRules));

    const onDelete = () => {
        history.push(`/enrollment?${buildUrlQueryString({ orgUnitId, programId, teiId })}`);
        dispatch(deleteEnrollment({ enrollmentId }));
    };
    const onEnrollmentError = message => dispatch(showEnrollmentError({ message }));
    const onAddNew = () => {
        history.push(`/new?${buildUrlQueryString({ programId, orgUnitId, teiId })}`);
    };

    const onGoBack = () => history.push(`/enrollment?${buildUrlQueryString({ orgUnitId, programId, teiId, enrollmentId })}`);
    const enrollmentSite = useCommonEnrollmentDomainData(teiId, enrollmentId, programId).enrollment;
    const { teiDisplayName } = useTeiDisplayName(teiId, programId);
    // $FlowFixMe
    const trackedEntityName = program?.trackedEntityType?.name;
    const enrollmentsAsOptions = buildEnrollmentsAsOptions([enrollmentSite || {}], programId);
    const event = enrollmentSite?.events?.find(item => item.event === eventId);
    const eventDataConvertValue = convertValue((event?.occurredAt || event?.scheduledAt), dataElementTypes.DATETIME);
    const eventDate = eventDataConvertValue ? eventDataConvertValue.toString() : '';

    let pageStatus = pageStatuses.MISSING_DATA;
    if (orgUnitId) {
        enrollmentSite && teiDisplayName && trackedEntityName && programStage && event
            ? (pageStatus = pageStatuses.DEFAULT)
            : (pageStatus = pageStatuses.MISSING_DATA);
    } else pageStatus = pageStatuses.WITHOUT_ORG_UNIT_SELECTED;

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
        />
    );
};
