import React from 'react';
import { EmptyValueFilterCheckboxes } from './EmptyValueFilterCheckboxes.component';
import { isEmptyValueFilter } from './emptyValueFilterHelpers';
import { EMPTY_VALUE_FILTER, NOT_EMPTY_VALUE_FILTER } from './emptyValue.const';
import type { WithEmptyValueFilterProps } from './emptyValue.types';

const handleCheckboxChange = (
    flag: string,
    onCommitValue: (value: any) => void,
) => ({ checked }: { checked: boolean }) => {
    onCommitValue(checked ? flag : null);
};

export const WithEmptyValueFilter = ({
    value,
    onCommitValue,
    disabled,
    children,
}: WithEmptyValueFilterProps) => {
    const isEmptyFilter = typeof value === 'string' && isEmptyValueFilter(value);
    const checkboxValue = isEmptyFilter ? value : undefined;
    const filteredValue = isEmptyFilter ? undefined : value;

    return (
        <>
            <EmptyValueFilterCheckboxes
                value={checkboxValue}
                onEmptyChange={handleCheckboxChange(EMPTY_VALUE_FILTER, onCommitValue)}
                onNotEmptyChange={handleCheckboxChange(NOT_EMPTY_VALUE_FILTER, onCommitValue)}
                disabled={disabled}
            />
            {children(filteredValue)}
        </>
    );
};
