import { Message } from '../../../WidgetErrorAndWarning/content/WidgetErrorAndWarningContent.types';
import { WidgetData } from '../../../WidgetFeedback/WidgetFeedback.types';

export interface HideWidgets {
    feedback: boolean;
    indicator: boolean;
}

export interface WidgetEffects {
    feedbacks?: Array<WidgetData> | null;
    warnings?: Array<Message> | null;
    errors?: Array<Message> | null;
    indicators?: Array<WidgetData> | null;
}
