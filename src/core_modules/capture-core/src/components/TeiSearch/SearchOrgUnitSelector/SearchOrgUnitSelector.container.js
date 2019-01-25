// @flow
import { connect } from 'react-redux';
import { requestFilterOrgUnitRoots, clearOrgUnitRoots } from '../../organisationUnits/organisationUnitRoots.actions';
import { setOrgUnitScope, setOrgUnit } from './searchOrgUnitSelector.actions';
import { get as getOrgUnitRoots } from '../../FormFields/New/Fields/OrgUnitField/orgUnitRoots.store';
import SearchOrgUnitSelector from './SearchOrgUnitSelector.component';
import { batchActionTypes } from '../SearchProgramSelector/searchProgramSelector.actions';

const mapStateToProps = (state: ReduxState, props: Object) => {
    const searchId = props.searchId;

    const filteredRoots = getOrgUnitRoots(searchId);
    const roots = filteredRoots || getOrgUnitRoots('searchRoots');

    return {
        selectedOrgUnit: state.teiSearch[searchId].selectedOrgUnit,
        selectedOrgUnitScope: state.teiSearch[searchId].selectedOrgUnitScope,
        treeRoots: roots,
        treeSearchText: filteredRoots && state.organisationUnitRoots[searchId].searchText,
        treeReady: !(filteredRoots && state.organisationUnitRoots[searchId].isLoading),
        treeKey: filteredRoots && state.organisationUnitRoots[searchId].searchText,
    };
};

// $FlowFixMe
const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onSearchOrgUnit: (searchId: string, searchText: string) => {
        const action = searchText ?
            requestFilterOrgUnitRoots(searchId, searchText, { withinUserHierarchy: true }) :
            clearOrgUnitRoots(searchId);
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
