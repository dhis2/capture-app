// @flow
import type { Message } from '../content/WidgetErrorAndWarningContent.types';

export type Props = {|
    error?: Array<Message>,
|}

export type PlainProps = {|
    error?: Array<Message>,
    ...CssClasses
|}
