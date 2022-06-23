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
const processErrorReports = (error) => {
    // $FlowFixMe[prop-missing]
    const conflicts = error?.details?.response?.conflicts;
    return conflicts?.length > 0
        ? conflicts.reduce((acc, errorReport) => `${acc} ${errorReport.value}`, '')
        : error.message;
};

export const Actions = ({ enrollment = {}, refetch, onDelete, onError }: Props) => {
    const [updateMutation, { loading: updateLoading }] = useDataMutation(
        enrollmentUpdate,
        {
            onComplete: () => {
                refetch();
            },
            onError: (e) => {
                onError && onError(processErrorReports(e));
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
