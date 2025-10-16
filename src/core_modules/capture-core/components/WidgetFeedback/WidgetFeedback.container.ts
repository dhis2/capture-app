import { connect } from 'react-redux';
import { WidgetFeedback } from './WidgetFeedback.component';

const mapStateToProps = (state: any, props: any) => ({
    feedback: [
        ...(state.rulesEffectsFeedback[props.dataEntryKey]?.displayTexts || []),
        ...(state.rulesEffectsFeedback[props.dataEntryKey]?.displayKeyValuePairs || []),
    ],
    emptyText: props.feedbackEmptyText
,
});

export const FeedbackSection = connect(mapStateToProps, () => ({}))(WidgetFeedback);

