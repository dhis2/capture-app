// @flow
import type { Program } from 'capture-core/metaData';
import type { ApiTEIEvent } from 'capture-core/events/getEnrollmentEvents';
import type { Stage } from 'capture-core/components/WidgetStagesAndEvents/types/common.types';

type HideWidgets = {|
    feedback: boolean,
    indicator: boolean,
|}

export type Props = {|
    program: Program,
    enrollmentId: string,
    teiId: string,
    events: Array<ApiTEIEvent>,
    stages: Array<Stage>,
    widgetEffects: ?Object,
    hideWidgets: HideWidgets,
    onDelete: () => void,
|};

export type PlainProps = {|
    ...Props,
    ...CssClasses,
|};
