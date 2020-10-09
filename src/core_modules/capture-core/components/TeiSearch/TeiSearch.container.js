// @flow
import { type ComponentType } from 'react';
import { connect } from 'react-redux';
import { TeiSearchComponent } from './TeiSearch.component';
import {
    requestSearchTei,
    searchFormValidationFailed,
    teiNewSearch,
    teiEditSearch,
    teiSearchResultsChangePage,
    setOpenSearchGroupSection,
} from './actions/teiSearch.actions';
import { makeSearchGroupsSelector } from './teiSearch.selectors';
import { type SearchGroup } from '../../metaData';


type PropsFromRedux = {|
    searchGroups: ?Array<SearchGroup>,
    showResults?: ?boolean,
    selectedProgramId: ?string,
    selectedTrackedEntityTypeId: ?string,
    openSearchGroupSection: ?string,
|}

type DispatchersFromRedux = {|
    onSearch: Function,
    onSearchValidationFailed: Function,
    onSetOpenSearchGroupSection: (searchId: string, searchGroupId: ?string) => void,
    onSearchResultsChangePage: (searchId: string, pageNumber: number) => void,
    onNewSearch: (searchId: string) => void,
    onEditSearch: (searchId: string) => void,
|}

type OwnProps = {|
    id: string,
    getResultsView: Function,
    resultsPageSize: number,
|}

export type Props = {| ...OwnProps, ...DispatchersFromRedux, ...PropsFromRedux, ...CssClasses |}

const makeMapStateToProps = () => {
    const searchGroupsSelector = makeSearchGroupsSelector();

    const mapStateToProps = (state: ReduxState, props: OwnProps) => {
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

export const TeiSearch: ComponentType<OwnProps> =
  connect<$Diff<Props, CssClasses>, OwnProps, _, _, _, _>(makeMapStateToProps, mapDispatchToProps)(TeiSearchComponent);
