import { connect } from 'react-redux';
import {
    setOrgUnitScope,
    setOrgUnit,
    requestFilterOrgUnits,
    clearOrgUnitsFilter,
} from './searchOrgUnitSelector.actions';
import { get as getOrgUnitRoots } from '../../../../../FormFields/New/Fields/OrgUnitField/orgUnitRoots.store';
import { SearchOrgUnitSelector as SearchOrgUnitSelectorComponent } from './SearchOrgUnitSelector.component';
import type { ReduxState, ReduxDispatch } from '../../../../../App/withAppUrlSync.types';

const mapStateToProps = (state: ReduxState, props: { searchId: string }) => {
    const searchId = props.searchId;

    const filteredRoots = getOrgUnitRoots(searchId);
    const roots = filteredRoots || getOrgUnitRoots('searchRoots');

    return {
        selectedOrgUnit: (state as any).teiSearch[searchId].selectedOrgUnit,
        selectedOrgUnitScope: (state as any).teiSearch[searchId].selectedOrgUnitScope,
        treeRoots: roots,
        treeSearchText: (state as any).teiSearch[searchId].orgUnitsSearchText,
        treeReady: !(state as any).teiSearch[searchId].orgUnitsLoading,
        treeKey: (state as any).teiSearch[searchId].orgUnitsSearchText || 'initial',
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

export const SearchOrgUnitSelector = connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(
    SearchOrgUnitSelectorComponent,
);
