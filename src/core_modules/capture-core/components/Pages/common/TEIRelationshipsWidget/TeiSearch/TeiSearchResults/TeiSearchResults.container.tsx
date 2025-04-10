import { ComponentType } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { TeiSearchResultsComponent } from './TeiSearchResults.component';
import { withLoadingIndicator } from '../../../../../../HOC';
import { type OwnProps } from './TeiSearchResults.types';

type ReduxState = {
    teiSearch: {
        [key: string]: {
            searchResults?: {
                formId?: string;
                searchGroupId?: string;
                resultsLoading?: boolean;
                teis?: any[];
                currentPage?: number;
            };
        };
    };
    formsValues: {
        [key: string]: any;
    };
};

const mapStateToProps = (state: ReduxState, props: OwnProps) => {
    const currentTeiSearch = state.teiSearch[props.id] || {};
    const searchResults = currentTeiSearch.searchResults || {};
    const searchValues = state.formsValues[searchResults.formId || ''];
    const searchGroup = props.searchGroups[parseInt(searchResults.searchGroupId || '0', 10)];
    return {
        resultsLoading: searchResults.resultsLoading,
        teis: searchResults.teis || [],
        currentPage: searchResults.currentPage,
        searchValues,
        searchGroup,
    };
};

const mapDispatchToProps = () => ({});

export const TeiSearchResults: ComponentType<OwnProps> =
  compose<ComponentType<any>>(
      connect(mapStateToProps, mapDispatchToProps),
      withLoadingIndicator(() => ({ padding: '100px 0' }), null, (props: any) => (!props.resultsLoading)),
  )(TeiSearchResultsComponent);
