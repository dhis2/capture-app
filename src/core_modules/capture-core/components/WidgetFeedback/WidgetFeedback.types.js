// @flow

type displayText = {|
    id: string,
    message: string
|}

type filteredText = {|
    type: string,
    id: string,
    displayText?: Array<displayText>,
|}

type displayKeyValuePair = {|
    id: string,
    key: string,
    value: any
|}

type filteredKeyValue = {|
    type: string,
    id: string,
    displayKeyValuePair: Array<displayKeyValuePair>
|}

type feedbackRules = {|
    type: string,
    id: string,
    displayText?: displayText,
    displayKeyValuePair?: displayKeyValuePair
|}

export type Props = {|
    className?: string,
    feedbackRules: Array<feedbackRules>
|}

export type contentProps = {|
    filteredText?: filteredText,
    filteredKeyValue?: filteredKeyValue,
    ...CssClasses
|}
