import { connect } from 'react-redux';
import { IndicatorsSectionComponent } from './IndicatorsSection.component';

const mapStateToProps = (state: any) => ({
    indicators: state.rulesEffectsIndicators,
});

export const IndicatorsSection = connect(mapStateToProps)(IndicatorsSectionComponent);
