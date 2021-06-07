// @flow
import React from 'react';
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
// $FlowFixMe
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useHistory } from 'react-router';
import { useProgramInfo } from '../../../../hooks/useProgramInfo';
import { EnrollmentPageDefaultComponent } from './EnrollmentPageDefault.component';
import { urlArguments } from '../../../../utils/url';
import { useEnrollmentsAndAttributes, useProgramMetadata } from './hooks';
import { deleteEnrollment } from '../EnrollmentPage.actions';

export const EnrollmentPageDefault = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { enrollmentId, programId, teiId, orgUnitId } = useSelector(
        ({
            router: {
                location: { query },
            },
        }) => ({
            enrollmentId: query.enrollmentId,
            teiId: query.teiId,
            programId: query.programId,
            orgUnitId: query.orgUnitId,
        }),
        shallowEqual,
    );

    const { program } = useProgramInfo(programId);
    const { error: enrollmentsError, enrollment } = useEnrollmentsAndAttributes(teiId, enrollmentId);
    const { error: programMetaDataError, programMetadata } = useProgramMetadata(programId);

    if (programMetaDataError || enrollmentsError) {
        log.error(errorCreator('Enrollment page could not be loaded')({ programMetaDataError, enrollmentsError }));
    }

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
            programStages={programMetadata?.programStages}
            events={enrollment?.events ?? []}
            enrollmentId={enrollmentId}
            onDelete={onDelete}
        />
    );
};
