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

export type ContentType = {|
    widgetData?: ?Array<string | FilteredText | FilteredKeyValue>,
    noFeedbackText: string,
    ...CssClasses
|}

export type Props = {|
    feedback?: ?Array<string | FilteredText | FilteredKeyValue>,
    emptyText: string,
    ...CssClasses
|}

export type IndicatorProps = {|
    indicators?: ?Array<string | filteredText | filteredKeyValue>
|}
