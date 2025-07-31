import { connect } from 'react-redux';
import { ErrorsSectionComponent } from './ErrorsSection.component';

const mapStateToProps = (state: any) => ({
    errors: state.rulesEffectsGeneralErrors,
});

export const ErrorsSection = connect(mapStateToProps)(ErrorsSectionComponent);
