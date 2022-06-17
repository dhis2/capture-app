// @flow
import { connect } from 'react-redux';
import { OrgUnitField as BasicOrgUnitField } from '../../FormFields/New';
import { searchOrgUnits, clearOrgUnitsSearch } from './actions/orgUnitList.actions';

const mapStateToProps = (state: ReduxState) => {
    const orgUnits = state.registeringUnitList.roots ?? state.app.currentUser.organisationUnits;

    return {
        roots: orgUnits,
        searchText: state.registeringUnitList.searchText,
        ready: !state.registeringUnitList.isLoading,
        treeKey: state.registeringUnitList.key,
    };
};

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onSearch: (searchText: string) => {
        const action = searchText ? searchOrgUnits(searchText) : clearOrgUnitsSearch();
        dispatch(action);
    },
});

// $FlowFixMe[missing-annot] automated comment
export const OrgUnitField = connect(mapStateToProps, mapDispatchToProps)(BasicOrgUnitField);
