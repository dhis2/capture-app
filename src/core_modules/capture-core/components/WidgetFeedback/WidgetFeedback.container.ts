import { connect } from 'react-redux';
import { WidgetFeedbackComponent } from './WidgetFeedback.component';
import { FeedbackProps } from './WidgetFeedback.types';

const mapStateToProps = (state: any, props: FeedbackProps) => ({
    feedback: props.feedback || (props.dataEntryKey ? [
        ...(state.rulesEffectsFeedback[props.dataEntryKey]?.displayTexts || []),
        ...(state.rulesEffectsFeedback[props.dataEntryKey]?.displayKeyValuePairs || []),
    ] : []),
    feedbackEmptyText: props.feedbackEmptyText,
});

export const WidgetFeedback = connect(mapStateToProps, () => ({}))(WidgetFeedbackComponent);

