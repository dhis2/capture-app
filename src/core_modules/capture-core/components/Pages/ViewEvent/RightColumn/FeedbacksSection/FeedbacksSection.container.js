// @flow
import { connect } from 'react-redux';
import { FeedbacksSectionComponent } from './FeedbacksSection.component';

const mapStateToProps = (state: ReduxState, props: Object) => ({
    feedbacks: state.rulesEffectsFeedback[props.dataEntryKey],
});

// $FlowSuppress
// $FlowFixMe[missing-annot] automated comment
export const FeedbacksSection = connect(mapStateToProps, () => ({}))(FeedbacksSectionComponent);
