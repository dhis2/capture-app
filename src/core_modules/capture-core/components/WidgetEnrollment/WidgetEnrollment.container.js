// @flow
import React from 'react';
import { WidgetEnrollment as WidgetEnrollmentComponent } from './WidgetEnrollment.component';
import { useOrganizationUnit } from './hooks/useOrganizationUnit';
import { useTrackedEntityInstances } from './hooks/useTrackedEntityInstances';
import { useEnrollment } from './hooks/useEnrollment';
import { useProgram } from './hooks/useProgram';
import type { Props } from './enrollment.types';
import { plainStatus } from './constants/status.const';

export const WidgetEnrollment = ({ teiId, enrollmentId, programId, onDelete, onAddNew }: Props) => {
    const {
        error: errorEnrollment,
        enrollment,
        refetch: refetchEnrollment,
    } = useEnrollment(enrollmentId);
    const { error: errorProgram, program } = useProgram(programId);
    const { error: errorOwnerOrgUnit, ownerOrgUnit, enrollments, refetch: refetchTEI } = useTrackedEntityInstances(teiId, programId);
    const { error: errorOrgUnit, displayName } = useOrganizationUnit(ownerOrgUnit);
    const canAddNew = enrollments.every(item => item.status !== plainStatus.ACTIVE);

    return (
        <WidgetEnrollmentComponent
            enrollment={enrollment}
            canAddNew={canAddNew}
            program={program}
            refetchEnrollment={refetchEnrollment}
            refetchTEI={refetchTEI}
            ownerOrgUnit={{ id: ownerOrgUnit, displayName }}
            loading={!(enrollment && program && displayName)}
            onDelete={onDelete}
            onAddNew={onAddNew}
            error={
                errorEnrollment ||
                errorProgram ||
                errorOwnerOrgUnit ||
                errorOrgUnit
            }
        />
    );
};
