// @flow

import { connect } from 'react-redux';
import TeiSearch from './TeiSearch.component';

import {
    requestSearchTei,
    searchFormValidationFailed,
    teiNewSearch,
    teiEditSearch,
} from './actions/teiSearch.actions';
import { makeSearchGroupsSelector } from './teiSearch.selectors';


const makeMapStateToProps = () => {
    const searchGroupsSelector = makeSearchGroupsSelector();

    const mapStateToProps = (state: ReduxState, props: Object) => {
        const searchGroups = searchGroupsSelector(state, props);
        const searchId = props.id;
        return {
            searchGroups,
            showResults: state.teiSearch[props.id] && state.teiSearch[props.id].showResults,
            selectedProgramId: state.teiSearch[searchId].selectedProgramId,
            selectedTrackedEntityTypeId: state.teiSearch[searchId].selectedTrackedEntityTypeId,
        };
    };

    // $FlowSuppress
    return mapStateToProps;
};

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onSearch: (formId: string, searchGroupId: string, searchId: string) => {
        dispatch(requestSearchTei(formId, searchGroupId, searchId));
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
});

// $FlowSuppress
export default connect(makeMapStateToProps, mapDispatchToProps)(TeiSearch);
