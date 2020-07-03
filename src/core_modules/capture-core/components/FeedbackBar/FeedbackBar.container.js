// @flow
import { connect } from 'react-redux';
import FeedbackBar from './FeedbackBar.component';
import { closeFeedback } from './actions/feedback.actions';

const mapStateToProps = (state: ReduxState) => ({
    feedback: (state.feedbacks && state.feedbacks[0]) ? state.feedbacks[0] : undefined,
});

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onClose: () => {
        dispatch(closeFeedback());
    },
});

// $FlowFixMe[missing-annot] automated comment
export default connect(mapStateToProps, mapDispatchToProps)(FeedbackBar);
