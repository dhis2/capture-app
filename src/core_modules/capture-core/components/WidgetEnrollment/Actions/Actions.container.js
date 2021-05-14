// @flow
import { useDataMutation } from '@dhis2/app-runtime';
import React from 'react';
import { ActionsComponent } from './Actions.component';
import type { Props } from './actions.types';

const enrollmentMutation = {
    resource: 'enrollments',
    type: 'update',
    id: ({ enrollment }) => enrollment,
    data: enrollment => enrollment,
};

export const Actions = ({ enrollment = {}, refetch }: Props) => {
    const [mutate] = useDataMutation(enrollmentMutation, {
        onComplete: () => refetch(),
    });

    return <ActionsComponent enrollment={enrollment} mutate={mutate} />;
};
