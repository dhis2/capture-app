import { useCallback, useRef } from 'react';
import { useDataMutation, useTimeZoneConversion } from '@dhis2/app-runtime';
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
    const { fromClientDate } = useTimeZoneConversion();
    const prevEnrollment = useRef(enrollment);
    const [updateEnrollmentMutation] = useDataMutation(enrollmentUpdate, {
        onError: (e) => {
            setEnrollment(prevEnrollment.current);
            updateHandler?.(prevEnrollment.current[propertyName]);
            onError?.(processErrorReports(e));
        },
    });

    return useCallback((value: string) => {
        prevEnrollment.current = enrollment;
        const updatedEnrollment = { ...enrollment };
        updatedEnrollment[propertyName] = value;
        updatedEnrollment.updatedAt = fromClientDate(new Date()).getServerZonedISOString();
        setEnrollment(updatedEnrollment);
        updateEnrollmentMutation(updatedEnrollment);
        updateHandler?.(value);
    }, [enrollment, setEnrollment, propertyName, updateHandler, updateEnrollmentMutation, fromClientDate]);
};
