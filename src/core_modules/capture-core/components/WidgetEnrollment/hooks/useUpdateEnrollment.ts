import { useCallback } from 'react';
import { useDataMutation } from '@dhis2/app-runtime';
import type { Mutation } from 'capture-core-utils/types/app-runtime';
import { processErrorReports } from '../processErrorReports';

const enrollmentUpdate: Mutation = {
    resource: 'tracker?async=false&importStrategy=UPDATE',
    type: 'create',
    data: (enrollment: any) => ({
        enrollments: [enrollment],
    }),
};

type UseUpdateEnrollmentProps = {
    enrollment: any;
    setEnrollment: (enrollment: any) => void;
    propertyName: string;
    updateHandler?: (value: any) => void;
    onError?: (error: any) => void;
};

export const useUpdateEnrollment = ({
    enrollment,
    setEnrollment,
    propertyName,
    updateHandler,
    onError,
}: UseUpdateEnrollmentProps) => {
    const [updateEnrollmentMutation] = useDataMutation(enrollmentUpdate, {
        onError: (e) => {
            setEnrollment(enrollment);
            updateHandler && updateHandler(enrollment[propertyName]);
            onError && onError(processErrorReports(e));
        },
    });

    return useCallback((value: string) => {
        const updatedEnrollment = { ...enrollment };
        updatedEnrollment[propertyName] = value;
        setEnrollment(updatedEnrollment);
        updateEnrollmentMutation(updatedEnrollment);
        updateHandler && updateHandler(value);
    }, [enrollment, setEnrollment, propertyName, updateHandler, updateEnrollmentMutation]);
};
