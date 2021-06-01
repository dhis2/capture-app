// @flow

type filteredText = {|
    id: string,
    message: string,
|}

type filteredKeyValue = {|
    id: string,
    key: string,
    value: string,
|}

export type Props = {|
    displayText?: Array<filteredText>,
    displayKeyValue?: Array<filteredKeyValue>,
    ...CssClasses
|}
