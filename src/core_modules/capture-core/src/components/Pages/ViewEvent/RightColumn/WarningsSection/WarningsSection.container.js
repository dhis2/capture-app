// @flow
import { connect } from 'react-redux';
import WarningsSection from './WarningsSection.component';

const mapStateToProps = (state: ReduxState, props: Object) => ({
    warnings: state.rulesEffectsGeneralWarnings[props.dataEntryKey],
});

// $FlowSuppress
export default connect(mapStateToProps, () => ({}))(WarningsSection);
