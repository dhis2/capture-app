// @flow
import React, { useState, useEffect } from 'react';
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
// $FlowFixMe
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useCommonEnrollmentDomainData } from '../../common/EnrollmentOverviewDomain';
import { useProgramInfo } from '../../../../hooks/useProgramInfo';
import { EnrollmentPageDefaultComponent } from './EnrollmentPageDefault.component';
import {
    useTeiAttributes,
    useProgramMetadata,
    useHideWidgetByRuleLocations,
    useProgramStages,
    useOrganisationUnit,
} from './hooks';
import { runRulesForEnrollment } from './runRulesForEnrollment';
import { buildUrlQueryString } from '../../../../utils/routing';
import { deleteEnrollment } from '../EnrollmentPage.actions';
import { useFilteredWidgetData } from './hooks/useFilteredWidgetData';
import { useLocationQuery } from '../../../../utils/routing';


export const EnrollmentPageDefault = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { enrollmentId, programId, teiId, orgUnitId } = useLocationQuery();
    const { orgUnit } = useOrganisationUnit(orgUnitId);

    const { program } = useProgramInfo(programId);
    const { error: teiAttributesError, attributes } = useTeiAttributes(teiId);
    const { error: enrollmentsError, enrollment } = useCommonEnrollmentDomainData(teiId, enrollmentId, programId);
    const { error: programMetaDataError, programMetadata } = useProgramMetadata(programId);
    const stages = useProgramStages(program, programMetadata.programStages);

    if (programMetaDataError || enrollmentsError || teiAttributesError) {
        log.error(errorCreator('Enrollment page could not be loaded')(
            { programMetaDataError, enrollmentsError, teiAttributesError },
        ));
    }

    const [ruleEffects, setRuleEffects] = useState(undefined);
    const outputEffects = useFilteredWidgetData(ruleEffects);
    useEffect(() => {
        if (enrollment && enrollment.enrollment) {
            const effects = runRulesForEnrollment({ orgUnit, program, programMetadata, enrollment, attributes });
            if (effects) {
                // $FlowFixMe
                setRuleEffects(effects);
            }
        }
    }, [orgUnit, program, programMetadata, enrollment, attributes]);

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

    return (
        <EnrollmentPageDefaultComponent
            teiId={teiId}
            program={program}
            stages={stages}
            events={enrollment?.events}
            enrollmentId={enrollmentId}
            onDelete={onDelete}
            onViewAll={onViewAll}
            onCreateNew={onCreateNew}
            widgetEffects={outputEffects}
            hideWidgets={hideWidgets}
            onEventClick={onEventClick}
        />
    );
};
