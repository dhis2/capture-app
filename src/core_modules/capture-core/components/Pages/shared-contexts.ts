import { createContext } from 'react';

export type InitialValueOfResultsPageSizeContext = { resultsPageSize: number };

export const ResultsPageSizeContext =
  createContext<InitialValueOfResultsPageSizeContext>({ resultsPageSize: 5 });
