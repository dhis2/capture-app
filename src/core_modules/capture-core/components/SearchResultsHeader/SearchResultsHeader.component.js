// @flow
import React from 'react';
import { withStyles } from '@material-ui/core';
import i18n from '@dhis2/d2-i18n';
import type { CurrentSearchTerms } from '../Pages/Search/SearchForm/SearchForm.types';
import { convertValue } from '../../converters/clientToList';

const styles = (theme: Theme) => ({
    topSection: {
        marginTop: theme.typography.pxToRem(20),
        marginLeft: theme.typography.pxToRem(10),
        marginRight: theme.typography.pxToRem(10),
        marginBottom: theme.typography.pxToRem(10),
    },
});

type SearchResultsHeaderType = $ReadOnly<{|
  currentSearchTerms: CurrentSearchTerms,
  currentSearchScopeProgramName?: string,
  ...CssClasses
|}>

const SearchResultsHeaderPlain =
  ({ currentSearchTerms, currentSearchScopeProgramName, classes }: SearchResultsHeaderType) =>
      (<div data-test="dhis2-capture-search-results-top" className={classes.topSection} >
          {i18n.t('Results found')} {currentSearchScopeProgramName && `${i18n.t('in')} ${currentSearchScopeProgramName}`}
          <div>
              {
                  currentSearchTerms.map(({ name, value, id, type }, index, rest) => (
                      <span key={id}>
                          <i>{name}</i>: {convertValue(value, type)}
                          {index !== rest.length - 1 && <span>,&nbsp;</span>}
                      </span>
                  ))
              }
          </div>
      </div>
      );

export const SearchResultsHeader = withStyles(styles)(SearchResultsHeaderPlain);
