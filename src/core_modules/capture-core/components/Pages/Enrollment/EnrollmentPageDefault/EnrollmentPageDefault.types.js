// @flow
import type { Program } from '../../../../metaData';
import type { Message } from '../../../WidgetErrorAndWarning/content/WidgetErrorAndWarningContent.types';
import type { WidgetData } from '../../../WidgetFeedback/WidgetFeedback.types';

type HideWidgets = {|
    feedback: boolean,
    indicator: boolean,
|}

type WidgetEffects = {|
    feedbacks?: ?Array<WidgetData>,
    warnings?: ?Array<Message>,
    errors?: ?Array<Message>,
    indicators?: ?Array<WidgetData>
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
