// @flow

import { connect } from 'react-redux';
import TeiSearch from './TeiSearch.component';

import {
  requestSearchTei,
  searchFormValidationFailed,
  teiNewSearch,
  teiEditSearch,
  teiSearchResultsChangePage,
  setOpenSearchGroupSection,
} from './actions/teiSearch.actions';
import { makeSearchGroupsSelector } from './teiSearch.selectors';

const makeMapStateToProps = () => {
  const searchGroupsSelector = makeSearchGroupsSelector();

  const mapStateToProps = (state: ReduxState, props: Object) => {
    const searchGroups = searchGroupsSelector(state, props);
    const currentTeiSearch = state.teiSearch[props.id];
    return {
      searchGroups,
      showResults: !!currentTeiSearch.searchResults,
      selectedProgramId: currentTeiSearch.selectedProgramId,
      selectedTrackedEntityTypeId: currentTeiSearch.selectedTrackedEntityTypeId,
      openSearchGroupSection: currentTeiSearch.openSearchGroupSection,
    };
  };

  // $FlowFixMe[not-an-object] automated comment
  return mapStateToProps;
};

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
  onSearch: (formId: string, searchGroupId: string, searchId: string) => {
    dispatch(requestSearchTei(formId, searchGroupId, searchId));
  },
  onSearchResultsChangePage: (searchId: string, pageNumber: number) => {
    dispatch(teiSearchResultsChangePage(searchId, pageNumber));
  },
  onSearchValidationFailed: (formId: string, searchGroupId: string, searchId: string) => {
    dispatch(searchFormValidationFailed(formId, searchGroupId, searchId));
  },
  onNewSearch: (searchId: string) => {
    dispatch(teiNewSearch(searchId));
  },
  onEditSearch: (searchId: string) => {
    dispatch(teiEditSearch(searchId));
  },
  onSetOpenSearchGroupSection: (searchId: string, searchGroupId: ?string) => {
    dispatch(setOpenSearchGroupSection(searchId, searchGroupId));
  },
});

// $FlowSuppress
// $FlowFixMe[missing-annot] automated comment
export default connect(makeMapStateToProps, mapDispatchToProps)(TeiSearch);
