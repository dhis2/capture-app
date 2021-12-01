// @flow
import { useHistory } from 'react-router-dom';
// $FlowFixMe
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import React, { useState, useEffect } from 'react';
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { deleteEnrollment } from '../EnrollmentPage.actions';
import { useCommonEnrollmentDomainData } from '../../common/EnrollmentOverviewDomain';
import { buildUrlQueryString } from '../../../../utils/routing';
import { useProgramInfo } from '../../../../hooks/useProgramInfo';
import { runRulesForEnrollment } from './runRulesForEnrollment';
import { useFilteredWidgetData } from './hooks/useFilteredWidgetData';
import {
    useTeiAttributes,
    useProgramMetadata,
    useHideWidgetByRuleLocations,
    useProgramStages,
    useOrganisationUnit,
} from './hooks';
import { EnrollmentPageDefaultComponent } from './EnrollmentPageDefault.component';


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
