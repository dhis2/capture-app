import { createContext } from 'react';
import type { FiltersData, PaginationContextData } from './types';

export const FilterValuesContext = createContext<FiltersData | null>(null);
export const PaginationContext = createContext<PaginationContextData>({} as PaginationContextData);
