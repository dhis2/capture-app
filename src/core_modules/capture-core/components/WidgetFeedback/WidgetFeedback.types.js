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
