import { connect } from 'react-redux';
import { compose } from 'redux';
import { TeiSearchResultsComponent } from './TeiSearchResults.component';
import { withLoadingIndicator } from '../../../../../../HOC';

const mapStateToProps = (state, props) => {
    const currentTeiSearch = state.teiSearch[props.id] || {};
    const searchResults = currentTeiSearch.searchResults || {};
    const searchValues = state.formsValues[searchResults.formId];
    const searchGroup = props.searchGroups[parseInt(searchResults.searchGroupId, 10)];
    return {
        resultsLoading: searchResults.resultsLoading,
        teis: searchResults.teis || [],
        currentPage: searchResults.currentPage,
        searchValues,
        searchGroup,
    };
};

const mapDispatchToProps = () => ({});

export const TeiSearchResults =
  compose(
      connect(mapStateToProps, mapDispatchToProps),
      withLoadingIndicator(() => ({ padding: '100px 0' }), null, props => (!props.resultsLoading)),
  )(TeiSearchResultsComponent);
