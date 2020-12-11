// @flow
import { connect } from 'react-redux';
import IndicatorsSection from './IndicatorsSection.component';

const mapStateToProps = (state: ReduxState, props: Object) => ({
  indicators: state.rulesEffectsIndicators[props.dataEntryKey],
});

// $FlowSuppress
// $FlowFixMe[missing-annot] automated comment
export default connect(mapStateToProps, () => ({}))(IndicatorsSection);
