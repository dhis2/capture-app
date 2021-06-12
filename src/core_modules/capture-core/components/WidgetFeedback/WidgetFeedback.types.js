// @flow

export type filteredText = {|
    id: string,
    message: string,
|}

export type filteredKeyValue = {|
    id: string,
    key: string,
    value: string,
|}

export type contentType = {|
    widgetData?: ?Array<string | filteredText | filteredKeyValue>,
    ...CssClasses
|}

export type Props = {|
    feedback?: ?Array<string | filteredText | filteredKeyValue>,
    ...CssClasses
|}

export type IndicatorProps = {|
    indicators?: ?Array<string | filteredText | filteredKeyValue>
|}
