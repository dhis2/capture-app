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
    getCommittedValue: () => unknown,
) {
    return {
        onGetUpdateData: (updatedValue?: unknown) => instance.onGetUpdateData(updatedValue),
        onIsValid: () => {
            if (instance.onIsValid && !instance.onIsValid()) return false;
            if (minCharactersToSearch) {
                return isValidMinCharactersToSearch(getCommittedValue(), minCharactersToSearch);
            }
            return true;
        },
    };
}

export const withFilterValidation = () => (InnerComponent: React.ComponentType<any>) => {
    const WithFilterValidationPlain = (props: any) => {
        const { filterTypeRef, minCharactersToSearch, handleCommitValue, classes, ...rest } = props;
        const innerInstanceRef = useRef<UpdatableFilterContent<unknown> | null>(null);
        const committedValueRef = useRef<unknown>(undefined);
        const [committedValue, setCommittedValue] = useState<unknown>(undefined);

        const getCommittedValue = useCallback(() => committedValueRef.current, []);

        const wrappedRef = useCallback(
            (instance: UpdatableFilterContent<any> | null) => {
                innerInstanceRef.current = instance;
                const validatedFilter = instance
                    ? wrapFilterWithValidation(instance, minCharactersToSearch, getCommittedValue)
                    : null;
                filterTypeRef(validatedFilter);
            },
            [filterTypeRef, minCharactersToSearch, getCommittedValue],
        );

        const wrappedHandleCommitValue = useCallback(
            (value?: unknown, ...args: unknown[]) => {
                committedValueRef.current = value;
                setCommittedValue(value);
                handleCommitValue?.(value, ...args);
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
