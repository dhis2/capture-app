// @flow
import React from 'react';
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
// $FlowFixMe
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useCommonEnrollmentDomainData, showEnrollmentError } from '../../common/EnrollmentOverviewDomain';
import { useTrackerProgram } from '../../../../hooks/useTrackerProgram';
import { EnrollmentPageDefaultComponent } from './EnrollmentPageDefault.component';
import {
    useProgramMetadata,
    useHideWidgetByRuleLocations,
    useProgramStages,
    useOrganisationUnit,
    useRuleEffects,
} from './hooks';
import { urlArguments } from '../../../../utils/url';
import { deleteEnrollment } from '../EnrollmentPage.actions';
import { useFilteredWidgetData } from './hooks/useFilteredWidgetData';


export const EnrollmentPageDefault = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { enrollmentId, programId, teiId, orgUnitId } = useSelector(
        ({
            router: {
                location: { query },
            },
        },
        ) => (
            { enrollmentId: query.enrollmentId,
                teiId: query.teiId,
                programId: query.programId,
                orgUnitId: query.orgUnitId,
            }), shallowEqual);
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
        history.push(`/enrollment?${urlArguments({ orgUnitId, programId, teiId })}`);
        dispatch(deleteEnrollment({ enrollmentId }));
    };

    const onViewAll = (stageId) => {
        history.push(
            `/enrollment/stageEvents?${urlArguments({ orgUnitId, programId, stageId })}`);
    };

    const onCreateNew = (stageId) => {
        history.push(
            `/enrollmentEventNew?${urlArguments({ orgUnitId, programId, teiId, enrollmentId, stageId })}`,
        );
    };

    const onEnrollmentError = message => dispatch(showEnrollmentError({ message }));

    const onEventClick = (eventId: string, stageId: string) => {
        history.push(`/enrollmentEventEdit?${urlArguments({ orgUnitId, programId, teiId, enrollmentId, eventId, stageId })}`);
    };

    return (
        <EnrollmentPageDefaultComponent
            teiId={teiId}
            program={program}
            // $FlowFixMe
            stages={stages}
            events={enrollment?.events ?? []}
            enrollmentId={enrollmentId}
            onDelete={onDelete}
            onViewAll={onViewAll}
            onCreateNew={onCreateNew}
            widgetEffects={outputEffects}
            hideWidgets={hideWidgets}
            onEventClick={onEventClick}
            onEnrollmentError={onEnrollmentError}
        />
    );
};
