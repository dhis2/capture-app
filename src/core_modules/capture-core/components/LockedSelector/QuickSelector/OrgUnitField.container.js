// @flow
import { connect } from 'react-redux';
import { OrgUnitField as BasicOrgUnitField } from '../../FormFields/New';
import { get as getOrgUnitRoots } from '../../FormFields/New/Fields/OrgUnitField/orgUnitRoots.store';

const mapStateToProps = (state: ReduxState) => {
    const regUnitRootsState = getOrgUnitRoots('regUnit') || getOrgUnitRoots('captureRoots');

    return {
        roots: regUnitRootsState,
        searchText: state.registeringUnitList.searchText,
        ready: !state.registeringUnitList.isLoading,
        treeKey: state.registeringUnitList.key,
    };
};

const mapDispatchToProps = () => ({});

// $FlowFixMe[missing-annot] automated comment
export const OrgUnitField = connect(mapStateToProps, mapDispatchToProps)(BasicOrgUnitField);
