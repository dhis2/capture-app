// @flow
import React from 'react';
// $FlowFixMe
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useHistory } from 'react-router';
import { useProgramInfo } from '../../../../hooks/useProgramInfo';
import { EnrollmentPageDefaultComponent } from './EnrollmentPageDefault.component';
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
        }) => ({
            enrollmentId: query.enrollmentId,
            teiId: query.teiId,
            programId: query.programId,
            orgUnitId: query.orgUnitId,
        }),
        shallowEqual,
    );

    const { program } = useProgramInfo(programId);

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
        />
    );
};
