import React, { useEffect, useRef, useState } from 'react';
import { OrgUnitFilter as OrgUnitFilterInput } from './OrgUnitFilter.component';
import { getEmptyValueFilterValue, isEmptyFilterData } from '../EmptyValue';
import { useOrgUnitAutoSelect } from '../../../dataQueries';
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
    const { data: autoSelectOrgUnits } = useOrgUnitAutoSelect();
    const hasPreselected = useRef(false);

    useEffect(() => {
        if (!filter && !hasPreselected.current && (autoSelectOrgUnits as any)?.length === 1) {
            hasPreselected.current = true;
            const orgUnit = (autoSelectOrgUnits as any)[0];
            setValue({ id: orgUnit.id, name: orgUnit.name, path: orgUnit.path });
            handleCommitValue?.();
        }
    }, [filter, autoSelectOrgUnits, handleCommitValue]);

    const onCommitValue = (newValue: Value) => {
        hasPreselected.current = true;
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
