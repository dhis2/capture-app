// @flow
import React from 'react';
import { withStyles } from '@material-ui/core';
import i18n from '@dhis2/d2-i18n';
import type { CurrentSearchTerms } from '../SearchBox';
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
  currentSearchScopeName?: string,
  ...CssClasses
|}>

const SearchResultsHeaderPlain =
  ({ currentSearchTerms, currentSearchScopeName, classes }: SearchResultsHeaderType) =>
      (<div data-test="search-results-top" className={classes.topSection} >
          {i18n.t('Results found')} {currentSearchScopeName && `${i18n.t('in')} ${currentSearchScopeName}`}
          {currentSearchTerms && <div>
              {
                  currentSearchTerms.map(({ name, value, id, type }, index, rest) => (
                      <span key={id}>
                          <i>{name}</i>: {convertValue(value, type)}
                          {index !== rest.length - 1 && <span>,&nbsp;</span>}
                      </span>
                  ))
              }
          </div>}
      </div>
      );

export const SearchResultsHeader = withStyles(styles)(SearchResultsHeaderPlain);
