// @flow
export type Rule = {|
    id: string,
    message: string,
|}

export type Props = {|
    error?: Array<Rule> | Array<string>,
    ...CssClasses
|}
