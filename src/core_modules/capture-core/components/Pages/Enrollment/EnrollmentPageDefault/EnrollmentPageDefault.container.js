// @flow
import React, { useState, useEffect } from 'react';
// $FlowFixMe
import { useSelector, shallowEqual } from 'react-redux';
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { useProgramInfo } from '../../../../hooks/useProgramInfo';
import { EnrollmentPageDefaultComponent } from './EnrollmentPageDefault.component';
import { useEnrollmentsAndAttributes, useProgramMetadata } from '../hooks';
import { runRulesForEnrollment } from '../runRulesForEnrollment';

export const EnrollmentPageDefault = () => {
    const { enrollmentId, teiId, programId, orgUnitId } = useSelector(({
        router: {
            location: {
                query,
            },
        },
    }) => (
        { enrollmentId: query.enrollmentId,
            teiId: query.teiId,
            programId: query.programId,
            orgUnitId: query.orgUnitId,
        }), shallowEqual);
    const orgUnit = useSelector(({ organisationUnits }) => organisationUnits[orgUnitId], shallowEqual);

    const { program } = useProgramInfo(programId);
    const { error: enrollmentsError, enrollments, attributes } = useEnrollmentsAndAttributes(teiId);
    const { error: programMetaDataError, programMetadata } = useProgramMetadata(programId);

    if (programMetaDataError || enrollmentsError) {
        log.error(errorCreator('Enrollment page could not be loaded')({ programMetaDataError, enrollmentsError }));
    }

    const [ruleEffects, setRuleEffects] = useState(undefined);
    useEffect(() => {
        const effects = runRulesForEnrollment({ orgUnit, program, programMetadata, enrollments, attributes });
        if (effects) {
            setRuleEffects(effects);
        }
    }, [orgUnit, program, programMetadata, enrollments, attributes]);
    console.log({ ruleEffects });
    return (
        <EnrollmentPageDefaultComponent
            teiId={teiId}
            program={program}
            enrollmentId={enrollmentId}
        />
    );
};
