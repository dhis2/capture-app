// @flow
import { connect } from 'react-redux';
import DataEntry from './DataEntry.component';

const mapStateToProps = (state: ReduxState) => ({
    showDataEntry: state.newRelationshipRegisterTei.orgUnit && !state.newRelationshipRegisterTei.isLoading,
    programId: state.newRelationshipRegisterTei.programId,
});

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({});

// $FlowSuppress
export default connect(mapStateToProps, mapDispatchToProps)(DataEntry);
