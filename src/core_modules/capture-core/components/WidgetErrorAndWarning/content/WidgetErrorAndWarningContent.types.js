// @flow
import type { Rule, RuleObject } from '../WidgetError/WidgetError.types';

export type contentTypes = {|
    widgetData: Array<Rule> | Array<string>,
    type: string,
    ...CssClasses
|}

export type renderObjectType = {|
    rule: RuleObject,
    listItem: string,
|}

export type renderStringType = {|
    rule: string,
    listItem: string,
    index?: number,
|}

