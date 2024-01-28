// @flow
import React from 'react';
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
    onSuccess,
    onTransferOutsideCaptureScope,
    ...passOnProps
}: Props) => {
    const { updateMutation, updateLoading } = useUpdateEnrollment(refetchEnrollment, refetchTEI, onError);
    const { deleteMutation, deleteLoading } = useDeleteEnrollment(onDelete, onError);
    const { updateEnrollmentOwnership } = useUpdateOwnership({
        teiId: enrollment.trackedEntity,
        programId: enrollment.program,
        onTransferOutsideCaptureScope,
        refetchTEI,
    });

    return (
        <ActionsComponent
            enrollment={enrollment}
            onUpdate={updateMutation}
            onDelete={deleteMutation}
            onUpdateOwnership={updateEnrollmentOwnership}
            loading={updateLoading || deleteLoading}
            {...passOnProps}
        />
    );
};
