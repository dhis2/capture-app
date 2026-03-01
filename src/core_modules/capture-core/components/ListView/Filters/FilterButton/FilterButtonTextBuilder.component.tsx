import React, { memo, useMemo } from 'react';
import type { Props } from './filterButtonTextBuilder.types';
import { FilterButtonMain } from './FilterButtonMain.component';
import { buildButtonText } from './buttonTextBuilder';
import { useOrgUnitFilterButtonText } from '../../../FiltersForTypes/OrgUnit/useOrgUnitFilterButtonText';
import type { OrgUnitFilterData } from '../../../FiltersForTypes';
import { filterTypesObject } from '../filters.const';

export const FilterButtonTextBuilder = memo<Props>(({ filterValue, type, options, ...passOnProps }: Props) => {
    const orgUnitLabel = useOrgUnitFilterButtonText(
        type === filterTypesObject.ORGANISATION_UNIT ? (filterValue as OrgUnitFilterData | null) : null,
    );
    const buttonText = useMemo(() => {
        if (!filterValue) {
            return filterValue;
        }
        if (type === filterTypesObject.ORGANISATION_UNIT && orgUnitLabel != null) {
            return orgUnitLabel;
        }
        return buildButtonText(filterValue, type, options);
    }, [filterValue, type, options, orgUnitLabel]);
    return (
        <FilterButtonMain
            {...passOnProps}
            filterValue={filterValue}
            type={type}
            options={options}
            buttonText={buttonText}
        />
    );
});
