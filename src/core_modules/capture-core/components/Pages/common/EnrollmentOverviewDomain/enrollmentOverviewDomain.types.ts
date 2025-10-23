import type { Message } from '../../../WidgetErrorAndWarning/content/WidgetErrorAndWarningContent.types';
import type { FeedbackWidgetData } from '../../../WidgetFeedback';
import type { IndicatorWidgetData } from '../../../WidgetIndicator';

export type HideWidgets = {
    feedback: boolean;
    indicator: boolean;
};

export type WidgetEffects = {
    feedbacks?: Array<FeedbackWidgetData> | null;
    warnings?: Array<Message> | null;
    errors?: Array<Message> | null;
    indicators?: Array<IndicatorWidgetData> | null;
};
