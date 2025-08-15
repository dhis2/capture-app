import { connect } from 'react-redux';
import {
    setOrgUnitScope,
    setOrgUnit,
    requestFilterOrgUnits,
    clearOrgUnitsFilter,
} from './searchOrgUnitSelector.actions';
import { get as getOrgUnitRoots } from '../../../../../FormFields/New/Fields/OrgUnitField/orgUnitRoots.store';
import { SearchOrgUnitSelectorRefHandler } from './SearchOrgUnitSelectorRefHandler.component';
import type { ReduxState, ReduxDispatch } from '../../../../../App/withAppUrlSync.types';

const mapStateToProps = (state: ReduxState, props: { searchId: string }) => {
    const searchId = props.searchId;

    const filteredRoots = getOrgUnitRoots(searchId);
    const roots = filteredRoots || getOrgUnitRoots('searchRoots');

    const teiSearchState = (state as any).teiSearch?.[searchId] || {};
    return {
        selectedOrgUnit: teiSearchState.selectedOrgUnit,
        selectedOrgUnitScope: teiSearchState.selectedOrgUnitScope,
        treeRoots: roots,
        treeSearchText: teiSearchState.orgUnitsSearchText,
        treeReady: !teiSearchState.orgUnitsLoading,
        treeKey: teiSearchState.orgUnitsSearchText || 'initial',
    };
};

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onFilterOrgUnits: (searchId: string, searchText: string) => {
        const action = searchText ?
            requestFilterOrgUnits(searchId, searchText) :
            clearOrgUnitsFilter(searchId);
        dispatch(action);
    },
    onSetOrgUnit: (searchId: string, orgUnit?: any) => {
        dispatch(setOrgUnit(searchId, orgUnit));
    },
    onSelectOrgUnitScope: (searchId: string, orgUnitScope: string) => {
        dispatch(setOrgUnitScope(searchId, orgUnitScope));
    },
});

export const SearchOrgUnitSelector = connect(mapStateToProps, mapDispatchToProps)(
    SearchOrgUnitSelectorRefHandler,
);
