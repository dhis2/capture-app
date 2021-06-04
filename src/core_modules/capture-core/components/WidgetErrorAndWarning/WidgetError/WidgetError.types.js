// @flow
export type rule = {|
    id: string,
    message: string,
|}

export type Props = {|
    error?: Array<rule> | Array<string>,
    ...CssClasses
|}
