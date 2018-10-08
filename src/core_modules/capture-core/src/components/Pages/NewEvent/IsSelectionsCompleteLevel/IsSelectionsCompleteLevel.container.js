// @flow
import { connect } from 'react-redux';
import IsSelectionsCompleteLevel from './IsSelectionsCompleteLevel.component';

const mapStateToProps = (state: ReduxState) => ({
    isSelectionsComplete: !!state.currentSelections.complete,
});

const mapDispatchToProps = () => ({
});
// $FlowSuppress
export default connect(mapStateToProps, mapDispatchToProps)(IsSelectionsCompleteLevel);
