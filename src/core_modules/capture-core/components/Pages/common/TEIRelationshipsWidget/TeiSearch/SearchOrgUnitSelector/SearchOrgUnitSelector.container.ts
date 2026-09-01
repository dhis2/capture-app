import { connect } from 'react-redux';
import i18n from '@dhis2/d2-i18n';
import {
    setOrgUnitScope,
    setOrgUnit,
    requestFilterOrgUnits,
    clearOrgUnitsFilter,
} from './searchOrgUnitSelector.actions';
import { get as getOrgUnitRoots } from '../../../../../FormFields/New/Fields/OrgUnitField/orgUnitRoots.store';
import { SearchOrgUnitSelector as SearchOrgUnitSelectorComponent } from './SearchOrgUnitSelector.component';
import type { ReduxState, ReduxDispatch } from '../../../../../App/withAppUrlSync.types';
import { getTermLabel } from '../../../../../../metaData/helpers/customLabels';

const mapStateToProps = (state: ReduxState, props: { searchId: string }) => {
    const searchId = props.searchId;
    const teiSearch = (state as any).teiSearch[searchId];
    const programId: string | undefined = teiSearch.selectedProgramId;

    const filteredRoots = getOrgUnitRoots(searchId);
    const roots = filteredRoots || getOrgUnitRoots('searchRoots');

    return {
        selectedOrgUnit: teiSearch.selectedOrgUnit,
        selectedOrgUnitScope: teiSearch.selectedOrgUnitScope,
        treeRoots: roots,
        treeSearchText: teiSearch.orgUnitsSearchText,
        treeReady: !teiSearch.orgUnitsLoading,
        treeKey: teiSearch.orgUnitsSearchText || 'initial',
        orgUnitLabel: programId ? getTermLabel(programId, 'orgUnit') : i18n.t('organisation unit'),
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
