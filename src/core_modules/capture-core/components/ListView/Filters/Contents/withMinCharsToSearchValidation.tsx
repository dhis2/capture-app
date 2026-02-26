import React, { useRef, useState, useCallback } from 'react';
import i18n from '@dhis2/d2-i18n';
import { withStyles } from 'capture-core-utils/styles';
import type { UpdatableFilterContent } from '../../../FiltersForTypes';
import {
    isValidMinCharactersToSearch,
} from '../../../../utils/validation/validators/form/isValidMinCharactersToSearch';
import { filterTypesObject } from '../../../../components/WorkingLists/WorkingListsBase';
import type { Value } from '../../../../components/FiltersForTypes/Date/DateFilter.component';

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

const ISO_DATE_LENGTH = 10;

function getMinCharsErrorMessage(min: number, type?: string): string {
    const isDateType = type === filterTypesObject.DATE;
    if (isDateType && (!isDateType || min > ISO_DATE_LENGTH)) {
        return i18n.t(
            'This filter requires more characters than a date can provide.',
        );
    }
    return i18n.t('Please enter at least {{minCharactersToSearch}} character to filter', {
        minCharactersToSearch: min,
        count: min,
        defaultValue: 'Please enter at least {{minCharactersToSearch}} character to filter',
        defaultValue_plural: 'Please enter at least {{minCharactersToSearch}} characters to filter',
    });
}

function wrapFilterWithMinCharsValidation(
    instance: UpdatableFilterContent<unknown>,
    minCharactersToSearch: number | undefined,
    committedValueRef: React.MutableRefObject<Value>,
    showValidationErrors: () => void,
    type?: string,
) {
    return {
        onGetUpdateData: (updatedValue?: unknown) => instance.onGetUpdateData(updatedValue),
        onIsValid: () => {
            if (instance.onIsValid && !instance.onIsValid()) return false;
            if (minCharactersToSearch && (type !== filterTypesObject.DATE || minCharactersToSearch > ISO_DATE_LENGTH)) {
                return isValidMinCharactersToSearch(committedValueRef.current, minCharactersToSearch);
            }
            return true;
        },
        showValidationErrors,
    };
}

export const withMinCharsToSearchValidation = () => (InnerComponent: React.ComponentType<any>) => {
    const WithMinCharsToSearchValidation = (props: any) => {
        const { filterTypeRef, minCharactersToSearch, handleCommitValue, classes, type, ...rest } = props;
        const committedValueRef = useRef<Value>(undefined);
        const [committedValue, setCommittedValue] = useState<Value>(undefined);

        const showValidationErrors = useCallback(() => {
            setCommittedValue(committedValueRef.current);
        }, []);

        const wrappedRef = useCallback(
            (instance: UpdatableFilterContent<unknown> | null) => {
                const validatedFilter = instance
                    ? wrapFilterWithMinCharsValidation(
                        instance,
                        minCharactersToSearch,
                        committedValueRef,
                        showValidationErrors,
                        type,
                    )
                    : null;
                filterTypeRef(validatedFilter);
            },
            [filterTypeRef, minCharactersToSearch, showValidationErrors, type],
        );

        const wrappedHandleCommitValue = useCallback(
            (value?: Value, isBlur?: boolean) => {
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
            && committedValue !== undefined
            && (type !== filterTypesObject.DATE || minCharactersToSearch > ISO_DATE_LENGTH)
            && !isValidMinCharactersToSearch(committedValue, minCharactersToSearch),
        );

        return (
            <>
                <InnerComponent
                    filterTypeRef={wrappedRef}
                    minCharactersToSearch={minCharactersToSearch}
                    handleCommitValue={wrappedHandleCommitValue}
                    type={type}
                    {...rest}
                />
                {showError && (
                    <div className={classes?.errorContainer} data-test="filter-min-chars-error">
                        {getMinCharsErrorMessage(minCharactersToSearch, type)}
                    </div>
                )}
            </>
        );
    };

    return withStyles(getStyles)(WithMinCharsToSearchValidation);
};
