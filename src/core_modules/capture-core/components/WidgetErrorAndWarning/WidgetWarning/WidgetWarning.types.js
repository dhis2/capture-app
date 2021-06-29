// @flow
import { Rule } from '../WidgetError/WidgetError.types';

export type Props = {|
    warning?: ?Array<Rule>,
    ...CssClasses
|}
