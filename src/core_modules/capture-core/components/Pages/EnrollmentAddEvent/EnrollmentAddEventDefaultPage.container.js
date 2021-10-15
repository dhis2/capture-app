// @flow
import React from 'react';
import type { ComponentType } from 'react';
// $FlowFixMe
import { useSelector, shallowEqual } from 'react-redux';
import { EnrollmentAddEventPage } from './EnrollmentAddEventPage.container';


export const EnrollmentAddEventDefaultPage: ComponentType<{||}> = () => {
    const { teiId, programId, orgUnitId, enrollmentId } = useSelector(
        ({ router: { location: { query } } }) => ({
            teiId: query.teiId,
            programId: query.programId,
            orgUnitId: query.orgUnitId,
            enrollmentId: query.enrollmentId,
        }),
        shallowEqual,
    );
    const ready = programId && orgUnitId && enrollmentId && teiId;


    return (
        ready ? <EnrollmentAddEventPage /> : null
    );
};
