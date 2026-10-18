import React, { useCallback } from 'react';
import { ActionsComponent } from './Actions.component';
import type { Props } from './actions.types';
import { useUpdateEnrollment, useDeleteEnrollment } from '../dataMutation/dataMutation';
import { useUpdateOwnership } from './Transfer/hooks';
import { useAuthority, Authorities } from '../../../utils/authority';

export const Actions = ({
    enrollment = {},
    refetchEnrollment,
    refetchTEI,
    onDelete,
    onError,
    onUpdateEnrollmentStatus,
    onUpdateEnrollmentStatusError,
    onUpdateEnrollmentStatusSuccess,
    onSuccess,
    updateEnrollmentGeometry,
    onAccessLostFromTransfer,
    readOnly,
    ...passOnProps
}: Props) => {
    const handleUpdateGeometry = useCallback(
        ({ geometry }: Record<string, any>) => updateEnrollmentGeometry(geometry),
        [updateEnrollmentGeometry],
    );
    const { deleteMutation, deleteLoading } = useDeleteEnrollment(onDelete, onError, onSuccess);
    const { hasAuthority } = useAuthority(Authorities.ENROLLMENT_CASCADE_DELETE);
    const { updateEnrollmentOwnership, isTransferLoading } = useUpdateOwnership({
        teiId: enrollment.trackedEntity,
        programId: enrollment.program,
        onAccessLostFromTransfer,
        refetchTEI,
    });
    const {
        updateMutation: updateStatusMutation,
        updateLoading: updateStatusLoading,
        changeRedirect,
    } = useUpdateEnrollment(
        refetchEnrollment,
        refetchTEI,
        onUpdateEnrollmentStatusError,
        onUpdateEnrollmentStatusSuccess,
    );

    const handleUpdateStatus = useCallback(
        (enrollmentToUpdate, redirect) => {
            onUpdateEnrollmentStatus && onUpdateEnrollmentStatus(enrollmentToUpdate);
            changeRedirect(Boolean(redirect));
            updateStatusMutation(enrollmentToUpdate);
        },
        [updateStatusMutation, onUpdateEnrollmentStatus, changeRedirect],
    );

    if (readOnly) return null;

    return (
        <ActionsComponent
            enrollment={enrollment}
            onUpdate={handleUpdateGeometry}
            onUpdateStatus={handleUpdateStatus}
            onDelete={deleteMutation}
            canCascadeDeleteEnrollment={hasAuthority}
            loading={deleteLoading || updateStatusLoading}
            onUpdateOwnership={updateEnrollmentOwnership}
            isTransferLoading={isTransferLoading}
            {...passOnProps}
        />
    );
};
