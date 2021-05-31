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
    feedbackRules: Array<feedbackRules>,
    ...CssClasses
|}

export type contentProps = {|
    feedbackDisplayText?: Array<filteredText>,
    feedbackKeyValuePair?: Array<filteredKeyValue>,
    ...CssClasses
|}
