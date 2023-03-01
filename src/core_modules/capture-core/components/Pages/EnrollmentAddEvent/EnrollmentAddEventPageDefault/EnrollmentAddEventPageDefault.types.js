// @flow
import type { WidgetEffects, HideWidgets } from '../../common/EnrollmentOverviewDomain';
import type { ExternalSaveHandler } from '../../../WidgetEnrollmentEventNew';
import type { ProgramCategory } from '../../../FormFields/New/CategoryOptions/CategoryOptions.types';

export type Props = {|
    programId: string,
    stageId: string,
    orgUnitId: string,
    teiId: string,
    enrollmentId: string,
    onSave: ExternalSaveHandler,
    dataEntryHasChanges: boolean,
    onCancel: () => void,
    onDelete: () => void,
    onAddNew: () => void,
    onEnrollmentError: (message: string) => void,
    widgetEffects: ?WidgetEffects,
    hideWidgets: HideWidgets,
    rulesExecutionDependencies: Object,
    pageFailure: boolean,
    ready: boolean,
    widgetReducerName: string,
    programCategory?: ProgramCategory,
    ...CssClasses,
|};

export type ContainerProps = {|
    enrollment: ?Object,
    attributeValues: ?Object,
    commonDataError: boolean,
|}
