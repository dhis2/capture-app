// @flow
import type { ProgramStage } from '../../../metaData';
import type { WidgetEffects, HideWidgets } from '../common/EnrollmentOverviewDomain';
import type { InputRelationship, RelationshipType } from '../../WidgetRelationships/types';

export type PlainProps = {|
    programStage: ?ProgramStage,
    widgetEffects: WidgetEffects,
    hideWidgets: HideWidgets,
    teiId: string,
    eventId: string,
    enrollmentId: string,
    programId: string,
    mode: string,
    orgUnitId: string,
    trackedEntityName: string,
    teiDisplayName: string,
    relationships?: Array<InputRelationship>,
    eventRelationships?: Array<InputRelationship>,
    eventRelationshipTypes?: Array<RelationshipType>,
    teiRelationshipTypes?: Array<RelationshipType>,
    eventDate?: string,
    enrollmentsAsOptions: Array<Object>,
    onDelete: () => void,
    onAddNew: () => void,
    onGoBack: () => void,
    pageStatus: string,
    ...CssClasses,
|};
