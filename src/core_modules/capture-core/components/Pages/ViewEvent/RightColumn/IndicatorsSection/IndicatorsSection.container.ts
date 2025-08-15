import { connect } from 'react-redux';
import { IndicatorsSectionComponent } from './IndicatorsSection.component';

const mapStateToProps = (state: any, props: any) => ({
    indicators: state.rulesEffectsIndicators[props.dataEntryKey],
});

export const IndicatorsSection = connect(mapStateToProps, () => ({}))(IndicatorsSectionComponent);
