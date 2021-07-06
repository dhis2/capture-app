// @flow
import React from 'react';
// $FlowFixMe
import { useSelector, shallowEqual } from 'react-redux';
import { EnrollmentAddEventPageComponent } from './EnrollmentAddEventPage.component';

export const EnrollmentAddEventPage = () => {
    const { programId, orgUnitId } = useSelector(
        ({
            router: {
                location: { query },
            },
        }) => ({
            programId: query.programId,
            orgUnitId: query.orgUnitId,
        }),
        shallowEqual,
    );

    return (
        <EnrollmentAddEventPageComponent programId={programId} orgUnitId={orgUnitId} />
    );
};
