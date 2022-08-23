// @flow
import React from 'react';
// $FlowFixMe
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useCommonEnrollmentDomainData, showEnrollmentError } from '../common/EnrollmentOverviewDomain';
import { useTeiDisplayName } from '../common/EnrollmentOverviewDomain/useTeiDisplayName';
import { useProgramInfo } from '../../../hooks/useProgramInfo';
import { pageMode, pageStatuses } from './EnrollmentEditEventPage.constants';
import { EnrollmentEditEventPageComponent } from './EnrollmentEditEventPage.component';
import { useWidgetDataFromStore } from '../EnrollmentAddEvent/hooks';
import { useHideWidgetByRuleLocations } from '../Enrollment/EnrollmentPageDefault/hooks';
import { urlArguments } from '../../../utils/url';
import { deleteEnrollment } from '../Enrollment/EnrollmentPage.actions';
import { buildEnrollmentsAsOptions } from '../../ScopeSelector';
import { getScopeInfo } from '../../../metaData';
import { convertValue } from '../../../converters/clientToView';
import { dataElementTypes } from '../../../metaData/DataElement';

export const EnrollmentEditEventPage = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { programId, stageId, teiId, enrollmentId, orgUnitId, eventId } = useSelector(
        ({
            router: {
                location: { query },
            },
        }) => ({
            programId: query.programId,
            stageId: query.stageId,
            teiId: query.teiId,
            orgUnitId: query.orgUnitId,
            enrollmentId: query.enrollmentId,
            eventId: query.eventId,
        }),
        shallowEqual,
    );
    const { program } = useProgramInfo(programId);
    const showEditEvent = useSelector(({ viewEventPage }) => viewEventPage?.eventDetailsSection?.showEditEvent);
    const programStage = [...program.stages?.values()].find(item => item.id === stageId);
    const currentPageMode = showEditEvent ? pageMode.EDIT : pageMode.VIEW;
    const dataEntryKey = `singleEvent-${currentPageMode}`;
    const outputEffects = useWidgetDataFromStore(dataEntryKey);
    const hideWidgets = useHideWidgetByRuleLocations(program.programRules);

    const onDelete = () => {
        history.push(`/enrollment?${urlArguments({ orgUnitId, programId, teiId })}`);
        dispatch(deleteEnrollment({ enrollmentId }));
    };
    const onEnrollmentError = message => dispatch(showEnrollmentError({ message }));
    const onGoBack = () => history.push(`/enrollment?${urlArguments({ orgUnitId, programId, teiId, enrollmentId })}`);
    const enrollmentSite = useCommonEnrollmentDomainData(teiId, enrollmentId, programId).enrollment;
    const { teiDisplayName } = useTeiDisplayName(teiId, programId);
    const { trackedEntityName } = getScopeInfo(enrollmentSite?.trackedEntityType);
    const enrollmentsAsOptions = buildEnrollmentsAsOptions([enrollmentSite || {}], programId);
    const event = enrollmentSite?.events?.find(item => item.event === eventId);
    const eventDataConvertValue = convertValue(event?.eventDate, dataElementTypes.DATETIME);
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
            orgUnitId={orgUnitId}
            eventDate={eventDate}
            onEnrollmentError={onEnrollmentError}
        />
    );
};
