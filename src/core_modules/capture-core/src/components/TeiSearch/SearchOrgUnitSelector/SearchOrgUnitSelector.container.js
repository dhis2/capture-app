// @flow
import { connect } from 'react-redux';
import { searchOrgUnits, clearOrgUnitsSearch, setOrgUnitScope, setOrgUnit } from './searchOrgUnitSelector.actions';
import { get as getOrgUnitRoots } from '../../FormFields/New/Fields/OrgUnitField/orgUnitRoots.store';
import SearchOrgUnitSelector from './SearchOrgUnitSelector.component';

const mapStateToProps = (state: ReduxState, props: Object) => {
    const teiSearchOrgUnitRootsState = getOrgUnitRoots(props.searchId) || getOrgUnitRoots('searchRoots');

    return {
        selectedOrgUnit: state.teiSearch[props.searchId].selectedOrgUnit,
        selectedOrgUnitScope: state.teiSearch[props.searchId].selectedOrgUnitScope,
        treeRoots: teiSearchOrgUnitRootsState,
        treeSearchText: state.teiSearch[props.searchId].orgUnitSearchText,
        treeReady: !state.teiSearch[props.searchId].orgUnitIsLoading,
        treeKey: state.teiSearch[props.searchId].orgUnitKey,
    };
};

// $FlowFixMe
const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onSearchOrgUnit: (searchId: string, searchText: string) => {
        const action = searchText ? searchOrgUnits(searchId, searchText) : clearOrgUnitsSearch(searchId);
        dispatch(action);
    },
    onSetOrgUnit: (searchId: string, orgUnit: ?any) => {
        dispatch(setOrgUnit(searchId, orgUnit));
    },
    onSelectOrgUnitScope: (searchId: string, orgUnitScope: string) => {
        dispatch(setOrgUnitScope(searchId, orgUnitScope));
    },
});

const mergeProps = (stateProps, dispatchProps, ownProps) => {
    const { innerRef, ...passOnOwnProps } = ownProps;
    return {
        ...passOnOwnProps,
        ...stateProps,
        ...dispatchProps,
        ref: innerRef,
    };
};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(SearchOrgUnitSelector);
