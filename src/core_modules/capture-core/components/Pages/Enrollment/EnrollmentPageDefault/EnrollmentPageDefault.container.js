// @flow
import React, { useState, useEffect, useMemo } from 'react';
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
// $FlowFixMe
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { useProgramInfo } from '../../../../hooks/useProgramInfo';
import { EnrollmentPageDefaultComponent } from './EnrollmentPageDefault.component';
import { useEnrollment, useTeiAttributes, useProgramMetadata, useProgramStages } from './hooks';
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

    const flatRuleActionLocations = useMemo(() => program.programRules.map(item => item.programRuleActions
        .map(rule => rule.location || null))
        .flat(), [program.programRules]);

    const hideWidgets = useMemo(() => {
        const hideWidgetObject = {};
        hideWidgetObject.feedback = !flatRuleActionLocations.includes('feedback');
        hideWidgetObject.indicator = !flatRuleActionLocations.includes('indicators');
        return hideWidgetObject;
    }, [flatRuleActionLocations]);


    const onDelete = () => {
        history.push(
            `/enrollment?${urlArguments({ orgUnitId, programId, teiId })}`,
        );
        dispatch(deleteEnrollment({ enrollmentId }));
    };

    return (
        <EnrollmentPageDefaultComponent
            teiId={teiId}
            program={program}
            stages={stages}
            events={enrollment?.events ?? []}
            enrollmentId={enrollmentId}
            onDelete={onDelete}
            widgetEffects={outputEffects}
            hideWidgets={hideWidgets}
        />
    );
};
