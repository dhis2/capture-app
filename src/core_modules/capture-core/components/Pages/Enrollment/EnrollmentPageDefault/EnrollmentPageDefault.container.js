// @flow
import React from 'react';
// $FlowFixMe
import { useSelector, shallowEqual } from 'react-redux';
import { useHistory } from 'react-router';
import { useProgramInfo } from '../../../../hooks/useProgramInfo';
import { EnrollmentPageDefaultComponent } from './EnrollmentPageDefault.component';
import { urlArguments } from '../../../../utils/url';

export const EnrollmentPageDefault = () => {
    const history = useHistory();
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

    const callbackDelete = () => {
        history.push(
            `/enrollment?${urlArguments({ orgUnitId, programId, teiId })}`,
        );
    };

    return (
        <EnrollmentPageDefaultComponent
            teiId={teiId}
            program={program}
            enrollmentId={enrollmentId}
            callbackDelete={callbackDelete}
        />
    );
};
