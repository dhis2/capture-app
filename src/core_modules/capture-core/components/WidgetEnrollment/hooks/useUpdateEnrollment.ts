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

type UseUpdateEnrollmentProps<TValue> = {
    enrollment: any;
    setEnrollment: (enrollment: any) => void;
    propertyName: string;
    updateHandler?: (value: TValue) => void;
    onError?: (error: any) => void;
};

export const useUpdateEnrollment = <TValue = string>({
    enrollment,
    setEnrollment,
    propertyName,
    updateHandler,
    onError,
}: UseUpdateEnrollmentProps<TValue>) => {
    const { fromClientDate } = useTimeZoneConversion();
    const prevEnrollment = useRef(enrollment);
    const [updateEnrollmentMutation] = useDataMutation(enrollmentUpdate, {
        onError: (e) => {
            setEnrollment(prevEnrollment.current);
            updateHandler?.(prevEnrollment.current[propertyName]);
            onError?.(processErrorReports(e));
        },
    });

    return useCallback((value: TValue) => {
        prevEnrollment.current = enrollment;
        const updatedEnrollment = { ...enrollment };
        updatedEnrollment[propertyName] = value;
        updatedEnrollment.updatedAt = fromClientDate(new Date()).getServerZonedISOString();
        setEnrollment(updatedEnrollment);
        updateEnrollmentMutation(updatedEnrollment);
        updateHandler?.(value);
    }, [enrollment, setEnrollment, propertyName, updateHandler, updateEnrollmentMutation, fromClientDate]);
};
