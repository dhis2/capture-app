// @flow
import { connect } from 'react-redux';
import { IndicatorsSectionComponent } from './IndicatorsSection.component';

const mapStateToProps = (state: ReduxState, props: Object) => ({
    indicators: state.rulesEffectsIndicators[props.dataEntryKey],
});

// $FlowSuppress
// $FlowFixMe[missing-annot] automated comment
export const IndicatorsSection = connect(mapStateToProps, () => ({}))(IndicatorsSectionComponent);
