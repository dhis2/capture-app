// @flow
import { connect } from 'react-redux';
import IndicatorsSection from './IndicatorsSection.component';

const mapStateToProps = (state: ReduxState, props: Object) => ({
    indicators: state.rulesEffectsIndicators[props.dataEntryKey],
});

// $FlowSuppress
export default connect(mapStateToProps, () => ({}))(IndicatorsSection);
