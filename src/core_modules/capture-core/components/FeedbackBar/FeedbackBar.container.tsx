import { connect } from 'react-redux';
import { FeedbackBarComponent } from './FeedbackBar.component';
import { closeFeedback } from './actions/feedback.actions';
import { Feedback } from './FeedbackBar.types';

type ReduxState = {
    feedbacks?: Feedback[];
};

type ReduxDispatch = {
    (action: { type: string; [key: string]: any }): void;
};

const mapStateToProps = (state: ReduxState) => ({
    feedback: (state.feedbacks && state.feedbacks[0]) ? state.feedbacks[0] : { message: '' },
});

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onClose: () => {
        dispatch(closeFeedback());
    },
});

export const FeedbackBar = connect(mapStateToProps, mapDispatchToProps)(FeedbackBarComponent);
