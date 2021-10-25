// @flow
import React from 'react';
import type { ComponentType } from 'react';
import { EnrollmentAddEventPageDefault } from './EnrollmentAddEventPageDefault/EnrollmentAddEventPageDefault.container';
import { useLocationQuery } from '../../../utils/routing';

export const EnrollmentAddEventPage: ComponentType<{||}> = () => {
    const { teiId, programId, enrollmentId } = useLocationQuery();


    const ready = programId && enrollmentId && teiId;


    return (
        ready ? <EnrollmentAddEventPageDefault /> : null
    );
};
