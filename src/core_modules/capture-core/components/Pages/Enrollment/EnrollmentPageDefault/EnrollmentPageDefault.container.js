// @flow
import React, { useState, useEffect } from 'react';
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
// $FlowFixMe
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { useProgramInfo } from '../../../../hooks/useProgramInfo';
import { EnrollmentPageDefaultComponent } from './EnrollmentPageDefault.component';
import { useEnrollmentsAndAttributes, useProgramMetadata, useProgramStages } from './hooks';
import { runRulesForEnrollment } from './runRulesForEnrollment';
import { urlArguments } from '../../../../utils/url';
import { deleteEnrollment } from '../EnrollmentPage.actions';


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
    const stages = useProgramStages(program, programMetadata.programStages);

    if (programMetaDataError || enrollmentsError) {
        log.error(errorCreator('Enrollment page could not be loaded')({ programMetaDataError, enrollmentsError }));
    }

    const [, setRuleEffects] = useState(undefined);
    useEffect(() => {
        const effects = runRulesForEnrollment({ orgUnit, program, programMetadata, enrollment, attributes });
        if (effects) {
            setRuleEffects(effects);
        }
    }, [orgUnit, program, programMetadata, enrollment, attributes]);

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
        />
    );
};
