// @flow
import React, { useCallback } from 'react';
import { errorCreator } from 'capture-core-utils';
import log from 'loglevel';
import { WidgetEnrollment as WidgetEnrollmentComponent } from './WidgetEnrollment.component';
import { useOrganizationUnit } from './hooks/useOrganizationUnit';
import { useTrackedEntityInstances } from './hooks/useTrackedEntityInstances';
import { useEnrollment } from './hooks/useEnrollment';
import { useProgram } from './hooks/useProgram';
import type { Props } from './enrollment.types';
import { plainStatus } from './constants/status.const';
import { useUpdateEnrollment } from './dataMutation/dataMutation';

export const WidgetEnrollment = ({ teiId, enrollmentId, programId, onDelete, onAddNew, onError, onSuccess }: Props) => {
    const { error: errorEnrollment, enrollment, refetch: refetchEnrollment } = useEnrollment(enrollmentId);
    const { error: errorProgram, program } = useProgram(programId);
    const {
        error: errorOwnerOrgUnit,
        ownerOrgUnit,
        enrollments,
        refetch: refetchTEI,
    } = useTrackedEntityInstances(teiId, programId);
    const { error: errorOrgUnit, displayName } = useOrganizationUnit(ownerOrgUnit);
    const canAddNew = enrollments
        .filter(item => item.program === programId)
        .every(item => item.status !== plainStatus.ACTIVE);
    const error = errorEnrollment || errorProgram || errorOwnerOrgUnit || errorOrgUnit;

    const { updateMutation } = useUpdateEnrollment(refetchEnrollment, refetchTEI, onError);

    if (error) {
        log.error(errorCreator('Enrollment widget could not be loaded')({ error }));
    }

    const handleSetCoordinates = useCallback((coordinates) => {
        if (enrollment) {
            updateMutation({ ...enrollment, geometry: { ...enrollment.geometry, coordinates } });
        }
    }, [enrollment, updateMutation]);

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
            onSetCoordinates={handleSetCoordinates}
            error={error}
            onError={onError}
            onSuccess={onSuccess}
        />
    );
};
