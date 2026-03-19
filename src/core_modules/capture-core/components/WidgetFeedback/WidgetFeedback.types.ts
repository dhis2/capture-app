export type FilteredFeedbackText = {
    id: string;
    message: string;
    color?: string;
}

export type FilteredFeedbackKeyValue = {
    id: string;
    key: string;
    value: string;
    color?: string;
}

export type FeedbackWidgetData = string | FilteredFeedbackText | FilteredFeedbackKeyValue;

export type FeedbackInputProps = {
    widgetEffects?: Record<string, unknown>;
    feedbackEmptyText: string;
}

export type FeedbackProps = {
    feedback?: Array<FeedbackWidgetData>;
    feedbackEmptyText: string;
    dataEntryKey?: string;
}
