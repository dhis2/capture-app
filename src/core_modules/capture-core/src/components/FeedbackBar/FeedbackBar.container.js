// @flow
import { connect } from 'react-redux';
import FeedbackBar from './FeedbackBar.component';
import { closeFeedback } from './actions/feedback.actions';

const mapStateToProps = (state: ReduxState) => ({
    feedback: state.feedbacks && state.feedbacks[0],
});

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onClose: () => {
        dispatch(closeFeedback());
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(FeedbackBar);
