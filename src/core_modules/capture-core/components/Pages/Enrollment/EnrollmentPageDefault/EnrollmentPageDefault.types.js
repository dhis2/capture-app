// @flow
import type { Program } from '../../../../metaData';

type HideWidgets = {|
    feedback: boolean,
    indicator: boolean,
|}

export type Props = {|
    program: Program,
    enrollmentId: string,
    teiId: string,
    widgetEffects: ?Object,
    hideWidgets: HideWidgets,
    onDelete: () => void,
|};

export type PlainProps = {|
    ...Props,
    ...CssClasses,
|};
