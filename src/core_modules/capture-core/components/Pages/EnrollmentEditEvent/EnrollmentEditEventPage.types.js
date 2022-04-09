// @flow
import type { ProgramStage } from '../../../metaData';
import type { WidgetEffects, HideWidgets } from '../common/EnrollmentOverviewDomain';
import type { OutputRelationship } from '../common/EnrollmentOverviewDomain/useCommonEnrollmentDomainData';

export type PlainProps = {|
    programStage: ?ProgramStage,
    widgetEffects: WidgetEffects,
    hideWidgets: HideWidgets,
    teiId: string,
    enrollmentId: string,
    programId: string,
    mode: string,
    orgUnitId: string,
    trackedEntityName: string,
    teiDisplayName: string,
    teiRelationships: Array<OutputRelationship>,
    eventRelationships: Array<OutputRelationship>,
    eventDate?: string,
    enrollmentsAsOptions: Array<Object>,
    onDelete: () => void,
    onAddNew: () => void,
    onGoBack: () => void,
    pageStatus: string,
    ...CssClasses,
|};
