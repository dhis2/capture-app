import React, { type ComponentType } from 'react';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';

import i18n from '@dhis2/d2-i18n';
import type { CurrentSearchTerms } from '../SearchBox';
import { convertValue } from '../../converters/clientToList';

const styles = (theme: any) => ({
    topSection: {
        marginBlockStart: theme.typography.pxToRem(8),
        marginInlineStart: 0,
        marginInlineEnd: 0,
        marginBlockEnd: 0,
    },
    resultsTitle: {
        marginTop: 0,
        marginBlockEnd: 4,
    },
});

type Props = {
  currentSearchTerms: CurrentSearchTerms;
  currentSearchScopeName?: string;
}

type SearchResultsHeaderProps = Props & WithStyles<typeof styles>;

const SearchResultsHeaderPlain =
  ({ currentSearchTerms, currentSearchScopeName, classes }: SearchResultsHeaderProps) =>
      (<div data-test="search-results-top" className={classes.topSection} >
          <p className={classes.resultsTitle}>
              {currentSearchScopeName
                  ? i18n.t('Results found in {{currentSearchScopeName}}', {
                      currentSearchScopeName,
                      interpolation: { escapeValue: false },
                  })
                  : i18n.t('Results found')}
          </p>
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

export const SearchResultsHeader = withStyles(styles)(SearchResultsHeaderPlain) as ComponentType<Props>;
