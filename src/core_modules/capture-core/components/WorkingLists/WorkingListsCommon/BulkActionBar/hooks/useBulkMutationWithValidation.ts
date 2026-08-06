import { useEffect, useMemo } from 'react';
import { useMutation } from '@tanstack/react-query';
import { extractValidationReport } from '../utils';
import type { ValidationReportContainer } from '../types';

type Options<TData, TVariables> = {
    mutationFn: (variables: TVariables) => Promise<TData>;
    // Clean success — HTTP 200 with no error reports. Do UI cleanup here
    // (close modal, refetch list, clear selection).
    onSuccess?: (response: TData, variables: TVariables) => void;
    // Partial success — HTTP 200 that still carries error reports (atomicMode=OBJECT).
    // Caller should remove valid rows from selection and refresh the list; the
    // hook keeps `validationError` set so the caller can render the error modal.
    onPartialSuccess?: (report: ValidationReportContainer, variables: TVariables) => void;
    // HTTP error WITH a validation report — server rejected the request but
    // told us which rows are the problem. Useful for "recover by retrying the
    // valid subset" flows. `validationError` is set regardless of whether this
    // callback is provided.
    onValidationError?: (report: ValidationReportContainer, variables: TVariables) => void;
    // HTTP error WITHOUT a validation report (network failure, 500, etc). Show a
    // toast here. Errors that carry a validation report are surfaced through
    // `validationError` (and `onValidationError`) and skip this callback.
    onFatalError?: (error: any, variables: TVariables) => void;
    // Modal-open flag (or similar). When it goes false, the mutation state resets
    // so the next open starts fresh.
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
