export type FilteredIndicatorText = {
    id: string;
    message: string;
    color?: string;
}

export type FilteredIndicatorKeyValue = {
    id: string;
    key: string;
    value: string;
    color?: string;
}

export type IndicatorWidgetData = string | FilteredIndicatorText | FilteredIndicatorKeyValue;

export type IndicatorProps = {
    indicators?: Array<IndicatorWidgetData>;
    indicatorEmptyText: string;
    dataEntryKey?: string;
}

export type IndicatorInputProps = {
    widgetEffects?: Record<string, unknown>;
    indicatorEmptyText: string;
}
