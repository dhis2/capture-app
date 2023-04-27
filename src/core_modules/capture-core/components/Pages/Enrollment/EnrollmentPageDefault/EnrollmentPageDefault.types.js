// @flow
import type { TrackerProgram } from 'capture-core/metaData';
import type { Stage } from 'capture-core/components/WidgetStagesAndEvents/types/common.types';
import type { WidgetEffects, HideWidgets } from '../../common/EnrollmentOverviewDomain';
import type { Url } from '../../../../utils/url';
import type { Event } from '../../common/EnrollmentOverviewDomain/useCommonEnrollmentDomainData';
import type { InputRelationship, RelationshipType } from '../../../WidgetRelationships/common.types';

export type Props = {|
    program: TrackerProgram,
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
    onLinkedRecordClick: (parameters: Url) => void,
    onEnrollmentError: (message: string) => void,
|};

export type PlainProps = {|
    ...Props,
    ...CssClasses,
|};
