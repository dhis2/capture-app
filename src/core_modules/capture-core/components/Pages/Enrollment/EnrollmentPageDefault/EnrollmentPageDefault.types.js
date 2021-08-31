// @flow
import type { Program } from 'capture-core/metaData';
import type { ApiTEIEvent } from 'capture-core/events/getEnrollmentEvents';
import type { Stage } from 'capture-core/components/WidgetStagesAndEvents/types/common.types';
import type { WidgetEffects, HideWidgets } from '../../common/EnrollmentOverviewDomain';

export type Props = {|
    program: Program,
    enrollmentId: string,
    teiId: string,
    events: Array<ApiTEIEvent>,
    stages: Array<Stage>,
    widgetEffects: ?WidgetEffects,
    hideWidgets: HideWidgets,
    onDelete: () => void,
    onViewAll: (stageId: string) => void,
    onCreateNew: (stageId: string) => void,
    onEventClick: (eventId: string, stageId: string) => void,
|};

export type PlainProps = {|
    ...Props,
    ...CssClasses,
|};
