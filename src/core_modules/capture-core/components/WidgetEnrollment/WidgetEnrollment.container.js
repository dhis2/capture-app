// @flow
import React from 'react';
import { errorCreator } from 'capture-core-utils';
import log from 'loglevel';
import { WidgetEnrollment as WidgetEnrollmentComponent } from './WidgetEnrollment.component';
import { useOrganizationUnit } from './hooks/useOrganizationUnit';
import { useTrackedEntityInstances } from './hooks/useTrackedEntityInstances';
import { useEnrollment } from './hooks/useEnrollment';
import { useProgram } from './hooks/useProgram';
import type { Props } from './enrollment.types';

export const WidgetEnrollment = ({ teiId, enrollmentId, programId, onDelete, onError }: Props) => {
    const { error: errorEnrollment, enrollment, refetch } = useEnrollment(enrollmentId);
    const { error: errorProgram, program } = useProgram(programId);
    const { error: errorOwnerOrgUnit, ownerOrgUnit } = useTrackedEntityInstances(teiId, programId);
    const { error: errorOrgUnit, displayName } = useOrganizationUnit(ownerOrgUnit);
    const error = errorEnrollment || errorProgram || errorOwnerOrgUnit || errorOrgUnit;

    if (error) {
        log.error(errorCreator('Enrollment widget could not be loaded'));
    }

    return (
        <WidgetEnrollmentComponent
            enrollment={enrollment}
            program={program}
            refetch={refetch}
            ownerOrgUnit={{ id: ownerOrgUnit, displayName }}
            loading={!(enrollment && program && displayName)}
            onDelete={onDelete}
            error={error}
            onError={onError}
        />
    );
};
