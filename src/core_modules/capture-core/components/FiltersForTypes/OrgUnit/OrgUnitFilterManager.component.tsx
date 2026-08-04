import React, { useState } from 'react';
import { OrgUnitFilter as OrgUnitFilterInput } from './OrgUnitFilter.component';
import { getEmptyValueFilterValue, isEmptyFilterData } from '../EmptyValue';
import type { OrgUnitFilter, OrgUnitFilterManagerProps, Value } from './orgUnit.types';

const calculateInitialValue = (filter: OrgUnitFilter | null | undefined): Value => {
    if (!filter) return undefined;
    if (isEmptyFilterData(filter)) return getEmptyValueFilterValue(filter);

    const { value, name } = filter;
    return { id: value, name: name ?? value, path: '' };
};

export const OrgUnitFilterManager = ({
    filter,
    filterTypeRef,
    handleCommitValue,
    ...passOnProps
}: OrgUnitFilterManagerProps) => {
    const [value, setValue] = useState<Value>(() => calculateInitialValue(filter));

    const onCommitValue = (newValue: Value) => {
        setValue(newValue);
        handleCommitValue?.();
    };

    return (
        <OrgUnitFilterInput
            value={value}
            ref={filterTypeRef}
            onCommitValue={onCommitValue}
            {...passOnProps}
        />
    );
};
