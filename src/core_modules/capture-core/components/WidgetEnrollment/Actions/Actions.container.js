// @flow
import { useDataMutation } from '@dhis2/app-runtime';
import React from 'react';
import { ActionsComponent } from './Actions.component';
import type { Props } from './actions.types';

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
const processErrorReports = (error) => {
    // $FlowFixMe[prop-missing]
    const errorReports = error?.details?.validationReport?.errorReports;
    return errorReports?.length > 0
        ? errorReports.reduce((acc, errorReport) => `${acc} ${errorReport.message}`, '')
        : error.message;
};

export const Actions = ({
    enrollment = {},
    refetchEnrollment,
    refetchTEI,
    onDelete,
    onError,
    onSuccess,
    ...passOnProps
}: Props) => {
    const [updateMutation, { loading: updateLoading }] = useDataMutation(
        enrollmentUpdate,
        {
            onComplete: () => {
                refetchEnrollment();
                refetchTEI();
                onSuccess && onSuccess();
            },
            onError: (e) => {
                onError && onError(processErrorReports(e));
            },
        },
    );
    const [deleteMutation, { loading: deleteLoading }] = useDataMutation(
        enrollmentDelete,
        {
            onComplete: () => {
                onDelete();
                onSuccess && onSuccess();
            },
            onError: (e) => {
                onError && onError(processErrorReports(e));
            },
        },
    );

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
