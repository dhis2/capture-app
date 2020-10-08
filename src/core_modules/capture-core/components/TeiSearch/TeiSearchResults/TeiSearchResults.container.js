// @flow
import { type ComponentType } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { TeiSearchResultsComponent } from './TeiSearchResults.component';
import { withLoadingIndicator } from '../../../HOC';

export type OwnProps = {|
    id: string,
    searchGroups: any,
    onChangePage: Function,
    onNewSearch: Function,
    onEditSearch: Function,
    onAddRelationship: (id: string, values: Object) => void,
    getResultsView: Function,
|}

export type PropsFromRedux = {|
    resultsLoading: boolean,
    teis: any,
    currentPage: number,
    searchValues: any,
    selectedProgramId: string,
    selectedTrackedEntityTypeId: string,
    searchGroup: any
|}

export type Props = {|...OwnProps, ...PropsFromRedux |}

const mapStateToProps = (state: ReduxState, props: OwnProps) => {
    const currentTeiSearch = state.teiSearch[props.id] || {};
    const searchResults = currentTeiSearch.searchResults || {};
    const searchValues = state.formsValues[searchResults.formId];
    // eslint-disable-next-line radix
    const searchGroup = props.searchGroups[parseInt(searchResults.searchGroupId)];
    return {
        resultsLoading: searchResults.resultsLoading,
        teis: searchResults.teis || [],
        currentPage: searchResults.currentPage,
        searchValues,
        selectedProgramId: currentTeiSearch.selectedProgramId,
        selectedTrackedEntityTypeId: currentTeiSearch.selectedTrackedEntityTypeId,
        searchGroup,
    };
};

const mapDispatchToProps = () => ({});

export const TeiSearchResults: ComponentType<OwnProps> =
  compose(
      connect<Props, OwnProps, _, _, _, _>(mapStateToProps, mapDispatchToProps),
      withLoadingIndicator(() => ({ padding: '100px 0' }), null, props => (!props.resultsLoading)),
  )(TeiSearchResultsComponent);
