// @flow

export type FilteredText = {|
    id: string,
    message: string,
    color?: ?string,
|}

export type FilteredKeyValue = {|
    id: string,
    key: string,
    value: string,
    color?: ?string,
|}

export type WidgetData = string | FilteredText | FilteredKeyValue;

export type ContentType = {|
    widgetData?: ?Array<WidgetData>,
    emptyText: string,
    ...CssClasses
|}

export type InputFeedbackProps = {|
    widgetEffects?: Object,
    feedbackEmptyText: string,
|}

export type Props = {|
    feedback?: ?Array<string | FilteredText | FilteredKeyValue>,
    emptyText: string,
|}

export type IndicatorProps = {|
    indicators?: ?Array<string | FilteredText | FilteredKeyValue>,
    emptyText: string,
|}

export type InputIndicatorProps = {|
    widgetEffects?: Object,
    indicatorEmptyText: string,
|}
