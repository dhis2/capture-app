// @flow
import type { Message } from '../content/WidgetErrorAndWarningContent.types';

export type Props = {|
    warning?: ?Array<Message>,
|}

export type PlainProps = {|
    ...Props,
    ...CssClasses
|}
