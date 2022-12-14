// @flow
import React from 'react';
import { useDeleteEnrollment, useUpdateEnrollment } from '../dataMutation/dataMutation';
import { ActionsComponent } from './Actions.component';
import type { Props } from './actions.types';

export const Actions = ({
    enrollment = {},
    refetchEnrollment,
    refetchTEI,
    onDelete,
    onError,
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
