import { connect } from 'react-redux';
import { FeedbacksSectionComponent } from './FeedbacksSection.component';

const mapStateToProps = (state: any) => ({
    feedbacks: state.rulesEffectsFeedback,
});

export const FeedbacksSection = connect(mapStateToProps)(FeedbacksSectionComponent);
