// @flow
import React, { useCallback } from 'react';
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
// $FlowFixMe
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useCommonEnrollmentDomainData, updateEnrollmentAttributeValues } from '../../common/EnrollmentOverviewDomain';
import { useTrackerProgram } from '../../../../hooks/useTrackerProgram';
import { EnrollmentPageDefaultComponent } from './EnrollmentPageDefault.component';
import {
    useProgramMetadata,
    useHideWidgetByRuleLocations,
    useProgramStages,
    useOrganisationUnit,
    useRuleEffects,
} from './hooks';
import { buildUrlQueryString, useLocationQuery } from '../../../../utils/routing';
import { deleteEnrollment, updateTeiDisplayName } from '../EnrollmentPage.actions';
import { useFilteredWidgetData } from './hooks/useFilteredWidgetData';

export const EnrollmentPageDefault = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { enrollmentId, programId, teiId, orgUnitId } = useLocationQuery();
    const { orgUnit } = useOrganisationUnit(orgUnitId);

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

    const onEventClick = (eventId: string, stageId: string) => {
        history.push(`/enrollmentEventEdit?${buildUrlQueryString({ orgUnitId, programId, teiId, enrollmentId, eventId, stageId })}`);
    };
    const onUpdateTeiAttributeValues = useCallback((updatedAttributeValues, teiDisplayName) => {
        dispatch(updateEnrollmentAttributeValues(updatedAttributeValues));
        dispatch(updateTeiDisplayName(teiDisplayName));
    }, [dispatch]);

    const onAddNew = () => {
        history.push(`/new?${buildUrlQueryString({ orgUnitId, programId, teiId })}`);
    };

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
            onUpdateTeiAttributeValues={onUpdateTeiAttributeValues}
        />
    );
};
