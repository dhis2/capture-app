import { useEffect, useMemo } from 'react';
import { useMutation } from '@tanstack/react-query';
import { extractValidationReport } from '../utils';
import type { ValidationReportContainer } from '../types';

type Options<TData, TVariables> = {
    mutationFn: (variables: TVariables) => Promise<TData>;
    onSuccess?: (response: TData, variables: TVariables) => void;
    onPartialSuccess?: (report: ValidationReportContainer, variables: TVariables) => void;
    onValidationError?: (report: ValidationReportContainer, variables: TVariables) => void;
    onFatalError?: (error: any, variables: TVariables) => void;
    active: boolean;
};

export const useBulkMutationWithValidation = <TData, TVariables>({
    mutationFn,
    onSuccess,
    onPartialSuccess,
    onValidationError,
    onFatalError,
    active,
}: Options<TData, TVariables>) => {
    const {
        mutate,
        isPending,
        data,
        error,
        reset,
    } = useMutation<TData, any, TVariables>(mutationFn, {
        onSuccess: (response, variables) => {
            const container = response as unknown as ValidationReportContainer | undefined;
            if (container?.validationReport?.errorReports?.length) {
                onPartialSuccess?.(container, variables);
                return;
            }
            onSuccess?.(response, variables);
        },
        onError: (err, variables) => {
            const details = err?.details as ValidationReportContainer | undefined;
            if (details?.validationReport?.errorReports?.length) {
                onValidationError?.(details, variables);
                return;
            }
            onFatalError?.(err, variables);
        },
    });

    const validationError = useMemo(
        () => extractValidationReport({ data, error }),
        [data, error],
    );

    useEffect(() => {
        if (!active) reset();
    }, [active, reset]);

    return { mutate, isPending, validationError, reset };
};
