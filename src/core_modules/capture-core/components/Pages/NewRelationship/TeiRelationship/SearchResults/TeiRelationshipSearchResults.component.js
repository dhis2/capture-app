// @flow

import React, { type ComponentType } from 'react';
import i18n from '@dhis2/d2-i18n';
import { withStyles } from '@material-ui/core';
import { Pagination } from 'capture-ui';
import withNavigation from '../../../../Pagination/withDefaultNavigation';
import Button from '../../../../Buttons/Button.component';
import makeAttributesSelector from './teiRelationshipSearchResults.selectors';
import { CardList } from '../../../../CardList';
import type { CurrentSearchTerms } from '../../../Search/SearchForm/SearchForm.types';
import { SearchResultsHeader } from '../../../../SearchResultsHeader';
import { type SearchResultItem } from '../../../Search/SearchResults/SearchResults.types';
import { type SearchGroup } from '../../../../../metaData';
import { ResultsPageSizeContext } from '../../../shared-contexts';

const SearchResultsPager = withNavigation()(Pagination);

type Props = {|
  onAddRelationship: (id: string, values: Object) => void,
  onChangePage: Function,
  onEditSearch: Function,
  onNewSearch: Function,
  currentPage: number,
  searchGroup: SearchGroup,
  searchValues: any,
  selectedProgramId: string,
  teis: Array<SearchResultItem>,
  trackedEntityTypeName: string,
  ...CssClasses,
|};

const getStyles = (theme: Theme) => ({
  itemActionsContainer: {
    paddingTop: theme.typography.pxToRem(10),
  },
  pagination: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginLeft: theme.typography.pxToRem(8),
    maxWidth: theme.typography.pxToRem(600),
  },
  topSection: {
    display: 'flex',
    flexDirection: 'column',
    margin: theme.typography.pxToRem(8),
    marginRight: 0,
    backgroundColor: theme.palette.grey.lighter,
    maxWidth: theme.typography.pxToRem(600),
  },
  topSectionValuesContainer: {
    padding: theme.typography.pxToRem(10),
  },
  actionButton: {
    margin: theme.typography.pxToRem(10),
    color: theme.palette.primary.dark,
    borderRadius: 0,
    border: `1px solid ${theme.palette.primary.dark}`,
  },
});

class TeiRelationshipSearchResultsPlain extends React.Component<Props> {
  getAttributes: Function;

  constructor(props: Props) {
    super(props);
    this.getAttributes = makeAttributesSelector();
  }

  onAddRelationship = (item) => {
    this.props.onAddRelationship(item.id, item.values);
  };

  getItemActions = ({ item }: Object) => {
    const { classes } = this.props;
    return (
      <div className={classes.itemActionsContainer}>
        <Button
          dataTest={`dhis2-capture-relationship-tei-link-${item.id}`}
          color="primary"
          onClick={() => this.onAddRelationship(item)}
        >
          {i18n.t('Link')}
        </Button>
      </div>
    );
  };

  renderResults = () => {
    const attributes = this.getAttributes(this.props);
    const { teis, trackedEntityTypeName, selectedProgramId } = this.props;

    return (
      <>
        {this.renderTopSection()}
        <CardList
          currentProgramId={selectedProgramId}
          items={teis}
          dataElements={attributes}
          noItemsText={i18n.t('No {{trackedEntityTypeName}} found.', {
            trackedEntityTypeName,
          })}
          getCustomItemBottomElements={(itemProps) => this.getItemActions(itemProps)}
        />
        {this.renderPager()}
      </>
    );
  };

  getSearchValues = (): CurrentSearchTerms => {
    const { searchValues, searchGroup } = this.props;
    const { searchForm } = searchGroup;
    return Object.keys(searchValues)
      .filter((key) => searchValues[key] !== null)
      .map((key) => {
        const element = searchForm.getElement(key);
        const value = searchValues[key];
        return {
          name: element.formName,
          value,
          id: element.id,
          type: element.type,
        };
      });
  };

  renderTopSection = () => {
    const { onNewSearch, onEditSearch, classes } = this.props;
    return (
      <div className={classes.topSection}>
        <SearchResultsHeader currentSearchTerms={this.getSearchValues()} />
        <div>
          <Button className={classes.actionButton} onClick={onNewSearch}>
            {i18n.t('New search')}
          </Button>
          <Button className={classes.actionButton} onClick={onEditSearch}>
            {i18n.t('Edit search')}
          </Button>
        </div>
      </div>
    );
  };

  renderPager = () => {
    const { onChangePage, currentPage, classes, teis } = this.props;
    return (
      <ResultsPageSizeContext.Consumer>
        {({ resultsPageSize }) => (
          <div className={classes.pagination}>
            <SearchResultsPager
              nextPageButtonDisabled={teis.length < resultsPageSize}
              onChangePage={(page) => onChangePage(page)}
              currentPage={currentPage}
            />
          </div>
        )}
      </ResultsPageSizeContext.Consumer>
    );
  };

  render() {
    return <div>{this.renderResults()}</div>;
  }
}

export const TeiRelationshipSearchResults: ComponentType<$Diff<Props, CssClasses>> = withStyles(
  getStyles,
)(TeiRelationshipSearchResultsPlain);
