// @flow
export type Rule = {|
    id: string,
    message: string,
|} | string;

export type Props = {|
    error?: Array<Rule>,
    ...CssClasses
|}
