import { connect } from 'react-redux';
import {
    setOrgUnitScope,
    setOrgUnit,
    requestFilterOrgUnits,
    clearOrgUnitsFilter,
} from './searchOrgUnitSelector.actions';
import { get as getOrgUnitRoots } from '../../FormFields/New/Fields/OrgUnitField/orgUnitRoots.store';
import { SearchOrgUnitSelector as SearchOrgUnitSelectorComponent } from './SearchOrgUnitSelector.component';
import { getTermLabel } from '../../../metaData/helpers/customLabels';

const mapStateToProps = (state: any, props: any) => {
    const searchId = props.searchId;
    const teiSearch = state.teiSearch[searchId];
    const programId = teiSearch.selectedProgramId;

    const filteredRoots = getOrgUnitRoots(searchId);
    const roots = filteredRoots || getOrgUnitRoots('searchRoots');

    return {
        selectedOrgUnit: teiSearch.selectedOrgUnit,
        selectedOrgUnitScope: teiSearch.selectedOrgUnitScope,
        treeRoots: roots,
        treeSearchText: teiSearch.orgUnitsSearchText,
        treeReady: !teiSearch.orgUnitsLoading,
        treeKey: teiSearch.orgUnitsSearchText || 'initial',
        orgUnitLabel: getTermLabel(programId, 'orgUnit'),
    };
};

const mapDispatchToProps = (dispatch: any) => ({
    onFilterOrgUnits: (searchId: string, searchText?: string) => {
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
