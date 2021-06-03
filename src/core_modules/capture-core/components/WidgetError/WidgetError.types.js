// @flow
export type rule = {|
    id: string,
    message: string,
|}

export type Props = {|
    showError?: Array<rule> | Array<string>,
    ...CssClasses
|}
