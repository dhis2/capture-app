// @flow
import { connect } from 'react-redux';
import ( ExistingTEILoader } from './ExistingTEILoader.component';

const mapStateToProps = (state: ReduxState) => ({
    programId: state.newRelationshipRegisterTei.programId,
});

// $FlowFixMe
export const ExistingTEILoader = connect(mapStateToProps, () => ({}))(ExistingTEILoader);
