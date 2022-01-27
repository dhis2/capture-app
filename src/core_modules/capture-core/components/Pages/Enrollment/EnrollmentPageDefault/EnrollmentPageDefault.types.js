// @flow
import type { Program } from 'capture-core/metaData';
import type { Stage } from 'capture-core/components/WidgetStagesAndEvents/types/common.types';
import type { WidgetEffects, HideWidgets } from '../../common/EnrollmentOverviewDomain';
import type { Event, OutputRelationship } from '../../common/EnrollmentOverviewDomain/useCommonEnrollmentDomainData';

export type Props = {|
    program: Program,
    enrollmentId: string,
    teiId: string,
    events: ?Array<Event>,
    stages?: Array<Stage>,
    relationships?: ?{
        relationshipsByType: Array<OutputRelationship>,
        headersByType: { [key: string]: Array<{id: string, label: string}> }
    },
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
