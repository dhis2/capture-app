// @flow

export type filteredText = {|
    id: string,
    message: string,
    color?: ?string,
|}

export type filteredKeyValue = {|
    id: string,
    key: string,
    value: string,
    color?: ?string,
|}

export type contentType = {|
    widgetData?: ?Array<string | filteredText | filteredKeyValue>,
    ...CssClasses
|}

export type Props = {|
    feedback?: ?Array<string | filteredText | filteredKeyValue>,
    hideWidget?: ?boolean,
    ...CssClasses
|}

export type IndicatorProps = {|
    indicators?: ?Array<string | filteredText | filteredKeyValue>
|}
