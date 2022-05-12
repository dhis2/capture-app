// @flow
import type { Program } from 'capture-core/metaData';
import type { Stage } from 'capture-core/components/WidgetStagesAndEvents/types/common.types';
import type { WidgetEffects, HideWidgets } from '../../common/EnrollmentOverviewDomain';
import type { Event, InputRelationship, RelationshipType } from '../../common/EnrollmentOverviewDomain/useCommonEnrollmentDomainData';
import type { Url } from '../../../../utils/url';

export type Props = {|
    program: Program,
    enrollmentId: string,
    teiId: string,
    events: ?Array<Event>,
    stages?: Array<Stage>,
    relationships?: Array<InputRelationship>,
    relationshipTypes?: Array<RelationshipType>,
    widgetEffects: ?WidgetEffects,
    hideWidgets: HideWidgets,
    orgUnitId: string,
    onDelete: () => void,
    onAddNew: () =>void,
    onViewAll: (stageId: string) => void,
    onCreateNew: (stageId: string) => void,
    onEventClick: (eventId: string, stageId: string) => void,
    onUpdateTeiAttributeValues: (attributes: Array<{ [key: string]: string }>, teiDisplayName: string) => void,
    onLinkedRecordClick: (parameters: Url) => void
|};

export type PlainProps = {|
    ...Props,
    ...CssClasses,
|};
