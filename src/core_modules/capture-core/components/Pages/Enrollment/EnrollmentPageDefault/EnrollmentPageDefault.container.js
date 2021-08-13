// @flow
import React, { useState, useEffect } from 'react';
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
// $FlowFixMe
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { useProgramInfo } from '../../../../hooks/useProgramInfo';
import { EnrollmentPageDefaultComponent } from './EnrollmentPageDefault.component';
import {
    useEnrollment,
    useTeiAttributes,
    useProgramMetadata,
    useHideWidgetByRuleLocations,
    useProgramStages,
} from './hooks';
import { runRulesForEnrollment } from './runRulesForEnrollment';
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
    const orgUnit = useSelector(({ organisationUnits }) => organisationUnits[orgUnitId]);


    const { program } = useProgramInfo(programId);
    const { error: teiAttributesError, attributes } = useTeiAttributes(teiId);
    const { error: enrollmentsError, enrollment } = useEnrollment(teiId);
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
        history.push(
            `/enrollment?${urlArguments({ orgUnitId, programId, teiId })}`,
        );
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

    return (
        <EnrollmentPageDefaultComponent
            teiId={teiId}
            program={program}
            stages={stages}
            events={enrollment?.events ?? []}
            enrollmentId={enrollmentId}
            onDelete={onDelete}
            onViewAll={onViewAll}
            onCreateNew={onCreateNew}
            widgetEffects={outputEffects}
            hideWidgets={hideWidgets}
        />
    );
};
