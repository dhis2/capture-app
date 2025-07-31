import { connect } from 'react-redux';
import { WarningsSectionComponent } from './WarningsSection.component';

const mapStateToProps = (state: any) => ({
    warnings: state.rulesEffectsWarnings,
});

export const WarningsSection = connect(mapStateToProps)(WarningsSectionComponent);
