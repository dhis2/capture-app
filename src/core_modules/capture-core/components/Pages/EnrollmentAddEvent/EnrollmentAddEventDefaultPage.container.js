// @flow
import React from 'react';
import type { ComponentType } from 'react';
// $FlowFixMe
import { useSelector, shallowEqual } from 'react-redux';
import { EnrollmentAddEventPage } from './EnrollmentAddEventPage.container';


export const EnrollmentAddEventDefaultPage: ComponentType<{||}> = () => {
    const { teiId, programId, enrollmentId } = useSelector(
        ({ router: { location: { query } } }) => ({
            teiId: query.teiId,
            programId: query.programId,
            enrollmentId: query.enrollmentId,
        }),
        shallowEqual,
    );
    const ready = programId && enrollmentId && teiId;


    return (
        ready ? <EnrollmentAddEventPage /> : null
    );
};
