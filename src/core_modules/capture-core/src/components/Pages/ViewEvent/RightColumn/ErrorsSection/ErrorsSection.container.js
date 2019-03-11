// @flow
import { connect } from 'react-redux';
import ErrorsSection from './ErrorsSection.component';

const mapStateToProps = (state: ReduxState, props: Object) => ({
    errors: state.rulesEffectsGeneralErrors[props.dataEntryKey],
});

// $FlowSuppress
export default connect(mapStateToProps, () => ({}))(ErrorsSection);
