// @flow
import React from 'react';
// $FlowFixMe
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { convertValue } from '../../../converters/clientToView';
import { useProgramInfo } from '../../../hooks/useProgramInfo';
import { getScopeInfo } from '../../../metaData';
import { dataElementTypes } from '../../../metaData/DataElement';
import { buildUrlQueryString } from '../../../utils/routing';
import { buildEnrollmentsAsOptions } from '../../ScopeSelector';
import { useCommonEnrollmentDomainData } from '../common/EnrollmentOverviewDomain';
import { useTeiDisplayName } from '../common/EnrollmentOverviewDomain/useTeiDisplayName';
import { deleteEnrollment } from '../Enrollment/EnrollmentPage.actions';
import { useHideWidgetByRuleLocations } from '../Enrollment/EnrollmentPageDefault/hooks';
import { useWidgetDataFromStore } from '../EnrollmentAddEvent/hooks';
import { EnrollmentEditEventPageComponent } from './EnrollmentEditEventPage.component';
import { pageMode, pageStatuses } from './EnrollmentEditEventPage.constants';

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
        history.push(`/enrollment?${buildUrlQueryString({ orgUnitId, programId, teiId })}`);
        dispatch(deleteEnrollment({ enrollmentId }));
    };
    const onGoBack = () => history.push(`/enrollment?${buildUrlQueryString({ orgUnitId, programId, teiId, enrollmentId })}`);
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
        />
    );
};
