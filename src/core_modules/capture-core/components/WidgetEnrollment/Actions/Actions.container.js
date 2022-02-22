// @flow
import { useHistory } from 'react-router-dom';
import { useDataMutation } from '@dhis2/app-runtime';
import React from 'react';
import { ActionsComponent } from './Actions.component';
import type { Props } from './actions.types';
import { deriveURLParamsFromLocation, buildUrlQueryString } from '../../../utils/routing';

const enrollmentUpdate = {
    resource: 'tracker?async=false&importStrategy=UPDATE',
    type: 'create',
    data: enrollment => ({
        enrollments: [enrollment],
    }),
};
const enrollmentDelete = {
    resource: 'tracker?async=false&importStrategy=DELETE',
    type: 'create',
    data: enrollment => ({
        enrollments: [enrollment],
    }),
};

export const Actions = ({ enrollment = {}, refetch, onDelete, ...passOnProps }: Props) => {
    const history = useHistory();
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
    const onHandleAddNew = () => {
        const { programId, orgUnitId } = deriveURLParamsFromLocation();
        history.push(`/new?${buildUrlQueryString({ programId, orgUnitId })}`);
    };

    return (
        <ActionsComponent
            enrollment={enrollment}
            onUpdate={updateMutation}
            onDelete={deleteMutation}
            onAddNew={onHandleAddNew}
            loading={updateLoading || deleteLoading}
            {...passOnProps}
        />
    );
};
