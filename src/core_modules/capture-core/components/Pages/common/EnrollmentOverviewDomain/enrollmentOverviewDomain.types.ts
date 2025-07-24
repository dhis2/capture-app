import type { Message } from '../../../WidgetErrorAndWarning/content/WidgetErrorAndWarningContent.types';
import type { WidgetData } from '../../../WidgetFeedback/WidgetFeedback.types';

export type HideWidgets = {
    feedback: boolean;
    indicator: boolean;
};

export type WidgetEffects = {
    feedbacks?: Array<WidgetData> | null;
    warnings?: Array<Message> | null;
    errors?: Array<Message> | null;
    indicators?: Array<WidgetData> | null;
};
