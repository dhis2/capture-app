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
const ID_LENGTH = 11;
const BOOLEAN_LENGTH = 4;
const ISO_TIME_LENGTH = 5;
const ISO_DATE_TIME_LENGTH = 26;
const PERCENTAGE_LENGTH = 3;

const MIN_CHARS_LIMIT_BY_TYPE: Partial<Record<string, number>> = {
    [filterTypesObject.DATE]: ISO_DATE_LENGTH,
    [filterTypesObject.ORGANISATION_UNIT]: ID_LENGTH,
    [filterTypesObject.BOOLEAN]: BOOLEAN_LENGTH,
    [filterTypesObject.TRUE_ONLY]: BOOLEAN_LENGTH,
    [filterTypesObject.DATETIME]: ISO_DATE_TIME_LENGTH,
    [filterTypesObject.TIME]: ISO_TIME_LENGTH,
    [filterTypesObject.PERCENTAGE]: PERCENTAGE_LENGTH,
    [filterTypesObject.AGE]: ISO_DATE_LENGTH,
};

function getMinCharsLimit(type?: string): number | undefined {
    return type ? MIN_CHARS_LIMIT_BY_TYPE[type] : undefined;
}

function getMinCharsErrorMessage(min: number, type?: string): string {
    const limitForType = getMinCharsLimit(type);
    if (limitForType && min > limitForType) {
        return i18n.t(
            'Minimum characters to search is too high for this filter.',
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
            const limitForType = getMinCharsLimit(type);
            if (minCharactersToSearch && limitForType && minCharactersToSearch > limitForType) {
                return false;
            }
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

        const limitForType = getMinCharsLimit(type);
        const showError = Boolean(
            minCharactersToSearch && (
                (limitForType && minCharactersToSearch > limitForType)
                || !isValidMinCharactersToSearch(committedValue, minCharactersToSearch)
            ),
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
