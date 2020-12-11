// @flow
import { createContext } from 'react';

type InitialValueOfResultsPageSizeContext = { resultsPageSize: number };

export const ResultsPageSizeContext = createContext<InitialValueOfResultsPageSizeContext>({
  resultsPageSize: 5,
});
