// @flow
import type { Program } from '../../../../metaData';
import type { Message } from '../../../WidgetErrorAndWarning/content/WidgetErrorAndWarningContent.types';

type HideWidgets = {|
    feedback: boolean,
    indicator: boolean,
|}

type WidgetEffects = {|
    feedbacks?: ?Array<Message>,
    warnings?: ?Array<Message>,
    errors?: ?Array<Message>,
    indicators?: ?Array<Message>
|}

export type Props = {|
    program: Program,
    enrollmentId: string,
    teiId: string,
    widgetEffects: ?WidgetEffects,
    hideWidgets: HideWidgets,
    onDelete: () => void,
|};

export type PlainProps = {|
    ...Props,
    ...CssClasses,
|};
