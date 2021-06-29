// @flow
import type { Rule, RuleObject } from '../WidgetError/WidgetError.types';

export type contentTypes = {|
    widgetData: Array<Rule> | Array<string>,
    type: string,
    ...CssClasses
|}

export type ObjectType = {|
    rule: RuleObject,
    listItem: string,
|}

export type StringType = {|
    rule: string,
    listItem: string,
    index?: number,
|}

