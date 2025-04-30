export type FilteredText = {
    id: string;
    message: string;
    color?: string | undefined;
}

export type FilteredKeyValue = {
    id: string;
    key: string;
    value: string;
    color?: string | undefined;
}

export type WidgetData = string | FilteredText | FilteredKeyValue;

export type CssClasses = {
    classes: {
        [key: string]: string;
    };
}

export type ContentType = {
    widgetData?: Array<WidgetData> | undefined;
    emptyText: string;
} & CssClasses;

export type InputFeedbackProps = {
    widgetEffects?: Record<string, unknown>;
    feedbackEmptyText: string;
}

export type Props = {
    feedback?: Array<string | FilteredText | FilteredKeyValue> | undefined;
    emptyText: string;
}

export type IndicatorProps = {
    indicators?: Array<string | FilteredText | FilteredKeyValue> | undefined;
    emptyText: string;
}

export type InputIndicatorProps = {
    widgetEffects?: Record<string, unknown>;
    indicatorEmptyText: string;
}
