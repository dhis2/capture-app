// @flow

export type FilteredText = {|
    id: string,
    message: string,
|}

export type FilteredKeyValue = {|
    id: string,
    key: string,
    value: string,
|}

export type WidgetData = string | FilteredText | FilteredKeyValue;

export type ContentType = {|
    widgetData?: ?Array<WidgetData>,
    emptyText: string,
    ...CssClasses
|}

export type Props = {|
    feedback?: ?Array<string | FilteredText | FilteredKeyValue>,
    emptyText: string,
    ...CssClasses
|}
