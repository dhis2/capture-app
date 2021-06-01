// @flow

type rule = {|
    id: string,
    message: string,
|}
export type contentTypes = {|
    widgetData: Array<rule> | Array<string>,
    ...CssClasses
|}
export type renderListItemType = {|
    rule: rule | string,
    listItem: string,
    index?: number,
|}

