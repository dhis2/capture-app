// @flow
type rule = {
    id: string,
    message: string,
}

export type widgetWarningTypes = {|
    warning?: Array<rule> | Array<string>,
    ...CssClasses
|}
