// @flow
import { connect } from 'react-redux';
import { OrgUnitField } from '../FormFields/New';

const mapStateToProps = (state: ReduxState) => ({
    roots: state.registeringUnitList.roots,
    searchText: state.registeringUnitList.searchText,
});

export default connect(mapStateToProps, () => ({}))(OrgUnitField);
