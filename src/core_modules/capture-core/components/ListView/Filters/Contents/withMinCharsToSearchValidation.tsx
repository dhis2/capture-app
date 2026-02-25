import React, { useRef, useState, useCallback } from 'react';
import i18n from '@dhis2/d2-i18n';
import { withStyles } from 'capture-core-utils/styles';
import type { UpdatableFilterContent } from '../../../FiltersForTypes';
import {
    isValidMinCharactersToSearch,
} from '../../../../utils/validation/validators/form/isValidMinCharactersToSearch';
import { filterTypesObject } from '../../../../components/WorkingLists/WorkingListsBase';
import type { Value } from '../../../../components/FiltersForTypes/Date/DateFilter.component';
import { mainOptionKeys } from '../../../../components/FiltersForTypes/Date/options';

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

function getMinCharsErrorMessage(min: number, type?: string, value?: Value): string {
    const isDateType = type === filterTypesObject.DATE;
    if (isDateType && value?.main !== mainOptionKeys.RELATIVE_RANGE) {
        return i18n.t(
            'This attribute\'s search settings require more characters than a date can provide.',
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
                    )
                    : null;
                filterTypeRef(validatedFilter);
            },
            [filterTypeRef, minCharactersToSearch, showValidationErrors],
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
                        {getMinCharsErrorMessage(minCharactersToSearch, type, committedValue)}
                    </div>
                )}
            </>
        );
    };

    return withStyles(getStyles)(WithMinCharsToSearchValidation);
};
