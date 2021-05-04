// @flow

type displayText = {|
    id: string,
    message: string
|}

type displayKeyValuePair = {|
    id: string,
    key: string,
    value: any
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

