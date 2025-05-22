import { useCallback } from 'react';
import { useDataMutation } from '@dhis2/app-runtime';
import { processErrorReports } from '../processErrorReports';

const enrollmentUpdate: any = {
    resource: 'tracker?async=false&importStrategy=UPDATE',
    type: 'create',
    data: (enrollmentData: any) => ({
        enrollments: [enrollmentData],
    }),
    id: 'enrollmentUpdate',
};

export const useUpdateEnrollment = ({
    enrollment,
    setEnrollment,
    propertyName,
    updateHandler,
    onError,
}: {
    enrollment: any;
    setEnrollment: (enrollmentData: any) => void;
    propertyName: string;
    updateHandler?: (value: any) => void;
    onError?: (error: any) => void;
}) => {
    const [updateEnrollmentMutation] = useDataMutation(enrollmentUpdate, {
        onError: (e) => {
            const originalEnrollment = enrollment;
            setEnrollment(originalEnrollment);
            updateHandler && updateHandler(originalEnrollment[propertyName]);
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
