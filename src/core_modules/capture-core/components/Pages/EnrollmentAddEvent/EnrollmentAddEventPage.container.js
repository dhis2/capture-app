// @flow
import React, { useCallback } from 'react';
import { batchActions } from 'redux-batched-actions';
// $FlowFixMe
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
    addEnrollmentEventPageActionTypes,
    navigateToEnrollmentPage,
} from './enrollmentAddEventPage.actions';
import { useProgramInfo } from '../../../hooks/useProgramInfo';
import { EnrollmentAddEventPageComponent } from './EnrollmentAddEventPage.component';
import { deleteEnrollment } from '../Enrollment/EnrollmentPage.actions';
import { useWidgetDataFromStore } from './hooks';
import { useHideWidgetByRuleLocations } from '../Enrollment/EnrollmentPageDefault/hooks';
import { useEnrollment } from '../common/EnrollmentOverviewDomain/useEnrollment';
import { useTeiDisplayName } from '../common/EnrollmentOverviewDomain/useTeiDisplayName';
import { buildEnrollmentsAsOptions } from '../../ScopeSelector';
import { getScopeInfo } from '../../../metaData';
import { pageStatuses } from './EnrollmentAddEventPage.constants';

export const EnrollmentAddEventPage = () => {
    const { programId, stageId, orgUnitId, teiId, enrollmentId } = useSelector(
        ({
            router: {
                location: { query },
            },
        }) => ({
            programId: query.programId,
            stageId: query.stageId,
            orgUnitId: query.orgUnitId,
            teiId: query.teiId,
            enrollmentId: query.enrollmentId,
        }),
        shallowEqual,
    );

    const dispatch = useDispatch();

    const handleCancel = useCallback(() => {
        dispatch(navigateToEnrollmentPage(programId, orgUnitId, teiId, enrollmentId));
    }, [dispatch, programId, orgUnitId, teiId, enrollmentId]);

    const handleSave = useCallback(() => {
        dispatch(navigateToEnrollmentPage(programId, orgUnitId, teiId, enrollmentId));
    }, [dispatch, programId, orgUnitId, teiId, enrollmentId]);

    const handleDelete = useCallback(() => {
        dispatch(batchActions([
            deleteEnrollment({ enrollmentId }),
            navigateToEnrollmentPage(programId, orgUnitId, teiId),
        ]));
    }, [dispatch, programId, orgUnitId, teiId, enrollmentId]);

    const widgetReducerName = 'enrollmentEvent-newEvent';

    // TODO: Validate query params
    // Ticket: https://jira.dhis2.org/browse/TECH-669
    const { program } = useProgramInfo(programId);
    const programStage = [...program.stages.values()].find(item => item.id === stageId);
    const outputEffects = useWidgetDataFromStore(widgetReducerName);
    const hideWidgets = useHideWidgetByRuleLocations(program.programRules);
    const enrollmentSite = useEnrollment(teiId).enrollment;
    const { teiDisplayName } = useTeiDisplayName(teiId, programId);
    const { trackedEntityName } = getScopeInfo(enrollmentSite?.trackedEntityType);
    const enrollmentsAsOptions = buildEnrollmentsAsOptions([enrollmentSite || {}], programId);

    let pageStatus = pageStatuses.MISSING_DATA;
    if (orgUnitId) {
        enrollmentSite && teiDisplayName && trackedEntityName
            ? (pageStatus = pageStatuses.DEFAULT)
            : (pageStatus = pageStatuses.MISSING_DATA);
    } else pageStatus = pageStatuses.WITHOUT_ORG_UNIT_SELECTED;

    if (!programStage) {
        return <span>[program stage placeholder]</span>;
    }

    // TODO: Get data from enrollment collection for the rules engine
    // Ticket: https://jira.dhis2.org/browse/TECH-635

    return (
        <EnrollmentAddEventPageComponent
            programId={programId}
            stageId={stageId}
            orgUnitId={orgUnitId}
            teiId={teiId}
            enrollmentId={enrollmentId}
            stageName={programStage.name}
            teiDisplayName={teiDisplayName}
            trackedEntityName={trackedEntityName}
            enrollmentsAsOptions={enrollmentsAsOptions}
            eventDateLabel={programStage.stageForm.getLabel('eventDate')}
            pageStatus={pageStatus}
            onSave={handleSave}
            onSaveSuccessActionType={addEnrollmentEventPageActionTypes.EVENT_SAVE_SUCCESS}
            onSaveErrorActionType={addEnrollmentEventPageActionTypes.EVENT_SAVE_ERROR}
            onCancel={handleCancel}
            onDelete={handleDelete}
            widgetEffects={outputEffects}
            hideWidgets={hideWidgets}
            widgetReducerName={widgetReducerName}
        />
    );
};
