// @flow
import React from 'react';
import { ActionsComponent } from './Actions.component';
import type { Props } from './actions.types';
import { useUpdateEnrollment, useDeleteEnrollment } from '../dataMutation/dataMutation';

export const Actions = ({
    enrollment = {},
    refetchEnrollment,
    refetchTEI,
    onDelete,
    onError,
    onSuccess,
    ...passOnProps
}: Props) => {
    const { updateMutation, updateLoading } = useUpdateEnrollment(refetchEnrollment, refetchTEI, onError);
    const { deleteMutation, deleteLoading } = useDeleteEnrollment(onDelete, onError);

    return (
        <ActionsComponent
            enrollment={enrollment}
            onUpdate={updateMutation}
            onDelete={deleteMutation}
            loading={updateLoading || deleteLoading}
            {...passOnProps}
        />
    );
};
