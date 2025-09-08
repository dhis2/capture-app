import { connect } from 'react-redux';
import { FeedbacksSectionComponent } from './FeedbacksSection.component';

const mapStateToProps = (state: any, props: any) => ({
    feedbacks: state.rulesEffectsFeedback[props.dataEntryKey],
});

export const FeedbacksSection = connect(mapStateToProps, () => ({}))(FeedbacksSectionComponent);
