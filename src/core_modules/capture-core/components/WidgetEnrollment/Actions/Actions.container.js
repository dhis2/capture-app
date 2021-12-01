// @flow
import React from 'react';
import { useDataMutation } from '@dhis2/app-runtime';
import type { Props } from './actions.types';
import { ActionsComponent } from './Actions.component';

const enrollmentUpdate = {
    resource: 'enrollments',
    type: 'update',
    id: ({ enrollment }) => enrollment,
    data: enrollment => enrollment,
};
const enrollmentDelete = {
    resource: 'enrollments',
    type: 'delete',
    id: ({ enrollment }) => enrollment,
};

export const Actions = ({ enrollment = {}, refetch, onDelete }: Props) => {
    const [updateMutation, { loading: updateLoading }] = useDataMutation(
        enrollmentUpdate,
        {
            onComplete: () => {
                refetch();
            },
        },
    );
    const [deleteMutation, { loading: deleteLoading }] = useDataMutation(
        enrollmentDelete,
        {
            onComplete: onDelete,
        },
    );
    return (
        <ActionsComponent
            enrollment={enrollment}
            onUpdate={updateMutation}
            onDelete={deleteMutation}
            loading={updateLoading || deleteLoading}
        />
    );
};
