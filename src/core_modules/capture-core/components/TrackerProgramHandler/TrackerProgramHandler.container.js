// @flow
import { connect } from 'react-redux';
import { TrackerProgramHandlerComponent } from './TrackerProgramHandler.component';

const mapStateToProps = (state: ReduxState) => ({
    programId: state.currentSelections.programId,
    orgUnitId: state.currentSelections.orgUnitId,
});

// $FlowSuppress
// $FlowFixMe[missing-annot] automated comment
export const TrackerProgramHandler = connect(mapStateToProps, () => ({}))(TrackerProgramHandlerComponent);
