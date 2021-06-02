// @flow
import type { rule } from '../WidgetError.types';

export type contentTypes = {|
    widgetData: Array<rule> | Array<string>,
    ...CssClasses
|}

export type renderObjectType = {|
    rule: rule,
    listItem: string,
|}

export type renderStringType = {|
    rule: string,
    listItem: string,
    index: number,
|}

