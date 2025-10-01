import { connect } from 'react-redux';
import i18n from '@dhis2/d2-i18n';
import { WidgetFeedback } from './WidgetFeedback.component';

const mapStateToProps = (state: any, props: any) => ({
    feedback: [
        ...(state.rulesEffectsFeedback[props.dataEntryKey]?.displayTexts || []),
        ...(state.rulesEffectsFeedback[props.dataEntryKey]?.displayKeyValuePairs || []),
    ],
    emptyText: i18n.t('No feedback to display'),
});

export const FeedbacksSection = connect(mapStateToProps, () => ({}))(WidgetFeedback);

