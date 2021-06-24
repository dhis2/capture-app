// @flow
import React, { useState, useEffect, useMemo } from 'react';
// $FlowFixMe
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { useProgramInfo } from '../../../../hooks/useProgramInfo';
import { EnrollmentPageDefaultComponent } from './EnrollmentPageDefault.component';
import { useEnrollmentsAndAttributes, useProgramMetadata } from './hooks';
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
    const { error: enrollmentsError, enrollment, attributes } = useEnrollmentsAndAttributes(teiId, enrollmentId);
    const { error: programMetaDataError, programMetadata } = useProgramMetadata(programId);

    if (programMetaDataError || enrollmentsError) {
        log.error(errorCreator('Enrollment page could not be loaded')({ programMetaDataError, enrollmentsError }));
    }

    const [ruleEffects, setRuleEffects] = useState(undefined);
    const outputEffects = useFilteredWidgetData(ruleEffects);
    useEffect(() => {
        const effects = runRulesForEnrollment({ orgUnit, program, programMetadata, enrollment, attributes });
        if (effects) {
            // $FlowFixMe
            setRuleEffects(effects);
        }
    }, [orgUnit, program, programMetadata, enrollment, attributes]);

    const feedbackWidgetHidden = useMemo(() => {
        const flattenedRuleActionLocations = program.programRules.map(item => item.programRuleActions
            .map(rule => rule.location || null))
            .flat();

        return !flattenedRuleActionLocations.includes('feedback');
    }, [program.programRules]);


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
            enrollmentId={enrollmentId}
            onDelete={onDelete}
            widgetEffects={outputEffects}
            hideFeedbackWidget={feedbackWidgetHidden}
        />
    );
};
