import { connect } from 'react-redux';
import { WidgetFeedbackComponent } from './WidgetFeedback.component';

const mapStateToProps = (state: any, props: any) => ({
    feedback: props.feedback || [
        ...(state.rulesEffectsFeedback[props.dataEntryKey]?.displayTexts || []),
        ...(state.rulesEffectsFeedback[props.dataEntryKey]?.displayKeyValuePairs || []),
    ],
    emptyText: props.feedbackEmptyText,
});

export const WidgetFeedback = connect(mapStateToProps, () => ({}))(WidgetFeedbackComponent);

