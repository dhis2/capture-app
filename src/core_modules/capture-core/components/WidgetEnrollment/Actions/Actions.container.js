// @flow
import React, { useCallback } from 'react';
import { ActionsComponent } from './Actions.component';
import type { Props } from './actions.types';
import { useUpdateEnrollment, useDeleteEnrollment } from '../dataMutation/dataMutation';
import { useUpdateOwnership } from './Transfer/hooks';

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
    onAccessLostFromTransfer,
    ...passOnProps
}: Props) => {
    const { updateMutation, updateLoading } = useUpdateEnrollment(refetchEnrollment, refetchTEI, onError, onSuccess);
    const { deleteMutation, deleteLoading } = useDeleteEnrollment(onDelete, onError, onSuccess);
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

    return (
        <ActionsComponent
            enrollment={enrollment}
            onUpdate={updateMutation}
            onUpdateStatus={handleUpdateStatus}
            onDelete={deleteMutation}
            loading={updateLoading || deleteLoading || updateStatusLoading}
            onUpdateOwnership={updateEnrollmentOwnership}
            isTransferLoading={isTransferLoading}
            {...passOnProps}
        />
    );
};
