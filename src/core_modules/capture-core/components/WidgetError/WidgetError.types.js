// @flow

type error = {
    id: string,
    message: string,
}

export type Props = {|
    showError: Array<error> | Array<string>,
    ...CssClasses
|}
