// @flow
import { useDataMutation } from '@dhis2/app-runtime';
import React from 'react';
import { ActionsComponent } from './Actions.component';
import type { Props } from './actions.types';

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

export const Actions = ({
    enrollment = {},
    refetch,
    callbackDelete,
}: Props) => {
    const [updateMutation] = useDataMutation(enrollmentUpdate, {
        onComplete: () => {
            refetch();
        },
    });
    const [deleteMutation] = useDataMutation(enrollmentDelete, {
        onComplete: callbackDelete,
    });
    return (
        <ActionsComponent
            enrollment={enrollment}
            updateAction={updateMutation}
            deleteAction={deleteMutation}
        />
    );
};
