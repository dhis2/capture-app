export type FilteredText = {
    id: string;
    message: string;
    color?: string | null;
}

export type FilteredKeyValue = {
    id: string;
    key: string;
    value: string;
    color?: string | null;
}

export type WidgetData = string | FilteredText | FilteredKeyValue;

export type ContentType = {
    widgetData?: Array<WidgetData> | null;
    emptyText: string;
}

export type InputFeedbackProps = {
    widgetEffects?: Record<string, unknown>;
    feedbackEmptyText: string;
}

export type Props = {
    feedback?: Array<string | FilteredText | FilteredKeyValue> | null;
    emptyText: string;
}

export type IndicatorProps = {
    indicators?: Array<string | FilteredText | FilteredKeyValue> | null;
    emptyText: string;
}

export type InputIndicatorProps = {
    widgetEffects?: Record<string, unknown>;
    indicatorEmptyText: string;
}
