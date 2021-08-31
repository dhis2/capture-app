// @flow
import type { ProgramStage } from '../../../metaData';
import type { ExternalSaveHandler } from '../../WidgetEnrollmentEventNew';

export type Props = {|
    programStage: ProgramStage,
    trackedEntityName: string,
    teiDisplayName: string,
    enrollmentsAsOptions: Array<Object>,
    pageStatus: string,
    programId: string,
    stageId: string,
    orgUnitId: string,
    teiId: string,
    enrollmentId: string,
    onSave: ExternalSaveHandler,
    onSaveSuccessActionType: string,
    onSaveErrorActionType: string,
    onCancel: () => void,
    ...CssClasses,
|};
