// @flow
import React, { useMemo, memo } from 'react';
import type { Props } from './filterButtonTextBuilder.types';
import { FilterButtonMain } from './FilterButtonMain.component';
import { buildButtonText } from './buttonTextBuilder';

export const FilterButtonTextBuilder = memo<Props>(
  ({ filterValue, type, options, ...passOnProps }: Props) => {
    const buttonText = useMemo(() => {
      if (!filterValue) {
        return filterValue;
      }
      return buildButtonText(filterValue, type, options);
    }, [filterValue, type, options]);

    return (
      <FilterButtonMain
        {...passOnProps}
        filterValue={filterValue}
        type={type}
        options={options}
        buttonText={buttonText}
      />
    );
  },
);
