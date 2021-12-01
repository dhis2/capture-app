// @flow
import { connect } from 'react-redux';
import { closeFeedback } from './actions/feedback.actions';
import { FeedbackBarComponent } from './FeedbackBar.component';

const mapStateToProps = (state: ReduxState) => ({
    feedback: (state.feedbacks && state.feedbacks[0]) ? state.feedbacks[0] : undefined,
});

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onClose: () => {
        dispatch(closeFeedback());
    },
});
// $FlowFixMe[missing-annot] automated comment
export const FeedbackBar = connect(mapStateToProps, mapDispatchToProps)(FeedbackBarComponent);
