import React, { useRef, useState, useCallback } from 'react';
import i18n from '@dhis2/d2-i18n';
import { withStyles } from 'capture-core-utils/styles';
import type { UpdatableFilterContent } from '../../../FiltersForTypes';
import {
    isValidMinCharactersToSearch,
} from '../../../../utils/validation/validators/form/isValidMinCharactersToSearch';

type Theme = {
    typography: { caption: Record<string, unknown>; pxToRem: (n: number) => string };
    palette: { error: { main: string } };
};

const getStyles = (theme: Theme) => ({
    errorContainer: {
        ...theme.typography.caption,
        color: theme.palette.error.main,
        paddingTop: theme.typography.pxToRem(4),
    },
});

function getMinCharsErrorMessage(min: number): string {
    return i18n.t('Please enter at least {{minCharactersToSearch}} character to filter', {
        minCharactersToSearch: min,
        count: min,
        defaultValue: 'Please enter at least {{minCharactersToSearch}} character to filter',
        defaultValue_plural: 'Please enter at least {{minCharactersToSearch}} characters to filter',
    });
}

function wrapFilterWithValidation(
    instance: UpdatableFilterContent<unknown>,
    minCharactersToSearch: number | undefined,
    committedValueRef: React.MutableRefObject<unknown>,
    showValidationErrors: () => void,
) {
    return {
        onGetUpdateData: (updatedValue?: unknown) => instance.onGetUpdateData(updatedValue),
        onIsValid: () => {
            if (instance.onIsValid && !instance.onIsValid()) return false;
            if (minCharactersToSearch) {
                return isValidMinCharactersToSearch(committedValueRef.current, minCharactersToSearch);
            }
            return true;
        },
        showValidationErrors,
    };
}

export const withFilterValidation = () => (InnerComponent: React.ComponentType<any>) => {
    const WithFilterValidationPlain = (props: any) => {
        const { filterTypeRef, minCharactersToSearch, handleCommitValue, classes, ...rest } = props;
        const committedValueRef = useRef<unknown>(undefined);
        const [committedValue, setCommittedValue] = useState<unknown>(undefined);

        const showValidationErrors = useCallback(() => {
            setCommittedValue(committedValueRef.current);
        }, []);

        const wrappedRef = useCallback(
            (instance: UpdatableFilterContent<unknown> | null) => {
                const validatedFilter = instance
                    ? wrapFilterWithValidation(instance, minCharactersToSearch, committedValueRef, showValidationErrors)
                    : null;
                filterTypeRef(validatedFilter);
            },
            [filterTypeRef, minCharactersToSearch, showValidationErrors],
        );

        const wrappedHandleCommitValue = useCallback(
            (value?: unknown, isBlur?: boolean) => {
                committedValueRef.current = value;
                if (isBlur) {
                    setCommittedValue(value);
                }
                handleCommitValue?.(value, isBlur);
            },
            [handleCommitValue],
        );

        const showError = Boolean(
            minCharactersToSearch
            && committedValue != null
            && committedValue !== ''
            && !isValidMinCharactersToSearch(committedValue, minCharactersToSearch),
        );

        return (
            <>
                <InnerComponent
                    filterTypeRef={wrappedRef}
                    minCharactersToSearch={minCharactersToSearch}
                    handleCommitValue={wrappedHandleCommitValue}
                    {...rest}
                />
                {showError && (
                    <div className={classes?.errorContainer} data-test="filter-min-chars-error">
                        {getMinCharsErrorMessage(minCharactersToSearch)}
                    </div>
                )}
            </>
        );
    };

    return withStyles(getStyles)(WithFilterValidationPlain);
};
