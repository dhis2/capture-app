// @flow
import { connect } from 'react-redux';
import {
    setOrgUnitScope,
    setOrgUnit,
    requestFilterOrgUnits,
    clearOrgUnitsFilter,
} from './searchOrgUnitSelector.actions';
import { get as getOrgUnitRoots } from '../../FormFields/New/Fields/OrgUnitField/orgUnitRoots.store';
import SearchOrgUnitSelector from './SearchOrgUnitSelector.component';

const mapStateToProps = (state: ReduxState, props: Object) => {
    const searchId = props.searchId;

    const filteredRoots = getOrgUnitRoots(searchId);
    const roots = filteredRoots || getOrgUnitRoots('searchRoots');

    return {
        selectedOrgUnit: state.teiSearch[searchId].selectedOrgUnit,
        selectedOrgUnitScope: state.teiSearch[searchId].selectedOrgUnitScope,
        treeRoots: roots,
        treeSearchText: state.teiSearch[searchId].orgUnitsSearchText,
        treeReady: !state.teiSearch[searchId].orgUnitsLoading,
        treeKey: state.teiSearch[searchId].orgUnitsSearchText || 'initial',
    };
};

// $FlowFixMe
const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onFilterOrgUnits: (searchId: string, searchText: string) => {
        const action = searchText ?
            requestFilterOrgUnits(searchId, searchText) :
            clearOrgUnitsFilter(searchId);
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
