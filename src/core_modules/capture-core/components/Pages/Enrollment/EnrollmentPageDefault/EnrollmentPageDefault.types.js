// @flow
import type { Program } from 'capture-core/metaData';
import type { Stage } from 'capture-core/components/WidgetStagesAndEvents/types/common.types';
import type { WidgetEffects, HideWidgets } from '../../common/EnrollmentOverviewDomain';
import type { Event } from '../../common/EnrollmentOverviewDomain/useCommonEnrollmentDomainData';
import type { RelationshipType } from '../../../WidgetTrackedEntityRelationship/WidgetTrackedEntityRelationship.types';

export type Props = {|
    program: Program,
    enrollmentId: string,
    teiId: string,
    events: ?Array<Event>,
    stages?: Array<Stage>,
    widgetEffects: ?WidgetEffects,
    hideWidgets: HideWidgets,
    orgUnitId: string,
    onDelete: () => void,
    onViewAll: (stageId: string) => void,
    onCreateNew: (stageId: string) => void,
    onEventClick: (eventId: string, stageId: string) => void,
    renderRelationshipRef: Object,
    relationshipTypes: ?Array<RelationshipType>
|};

export type PlainProps = {|
    ...Props,
    ...CssClasses,
|};
