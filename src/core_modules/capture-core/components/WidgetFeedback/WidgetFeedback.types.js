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

export type Props = {|
    feedback?: ?Array<string | filteredText | filteredKeyValue>,
    ...CssClasses
|}
