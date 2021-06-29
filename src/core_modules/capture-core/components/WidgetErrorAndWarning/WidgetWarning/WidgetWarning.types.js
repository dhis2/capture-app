// @flow
import type { Rule } from '../WidgetError/WidgetError.types';

export type Props = {|
    warning?: ?Array<Rule>,
    ...CssClasses
|}
