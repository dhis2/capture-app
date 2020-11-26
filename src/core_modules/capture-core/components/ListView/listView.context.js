// @flow
import { createContext } from 'react';
import type { FiltersData, PaginationContextData } from './types';

export const FilterValuesContext = createContext<?FiltersData>();
export const PaginationContext = createContext<PaginationContextData>({});
