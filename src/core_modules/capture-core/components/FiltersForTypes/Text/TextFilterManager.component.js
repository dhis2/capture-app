// @flow
import React, { useState, useCallback } from 'react';
import { TextFilter } from './TextFilter.component';
import type { TextFilterData } from './types';
import { NoValueFilter } from '../common';

type Props = {
    filter: ?TextFilterData,
    filterTypeRef: Function,
    handleCommitValue: () => void,
};

const calculateDefaultValue = (filter: ?TextFilterData): ?string =>
    (filter && filter.value ? filter.value : undefined);

export const TextFilterManager = (props: Props) => {
    const { filter, filterTypeRef, handleCommitValue, ...passOnProps } = props;
    const [value, setValue] = useState<?string>(() => calculateDefaultValue(filter));

    const handleCommitValueLocal = useCallback((newValue: ?string) => {
        setValue(newValue);
        handleCommitValue && handleCommitValue();
    }, [handleCommitValue]);

    return (
        <>
            <NoValueFilter
                value={value}
                onCommitValue={handleCommitValueLocal}
            />
            {/* $FlowFixMe[cannot-spread-inexact] automated comment */}
            <TextFilter
                value={value}
                onCommitValue={handleCommitValueLocal}
                {...passOnProps}
            />
        </>
    );
};
