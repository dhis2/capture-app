// @flow
export type MessageObject = {|
    id: string,
    message: string,
|}

export type Message = MessageObject | string;

export type contentTypes = {|
    widgetData: Array<Message> | Array<string>,
    type: string,
    ...CssClasses
|}

export type ObjectType = {|
    rule: MessageObject,
    listItem: string,
|}

export type StringType = {|
    message: string,
    listItem: string,
    index?: number,
|}

