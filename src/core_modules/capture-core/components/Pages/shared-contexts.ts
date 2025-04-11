import { createContext } from 'react';

export type ResultsPageSizeContextType = { resultsPageSize: number };

export const ResultsPageSizeContext =
  createContext<ResultsPageSizeContextType>({ resultsPageSize: 5 });
