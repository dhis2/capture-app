// @flow
export type RuleObject = {|
    id: string,
    message: string,
|}

export type Rule = RuleObject | string;

export type Props = {|
    error?: Array<Rule>,
    ...CssClasses
|}
