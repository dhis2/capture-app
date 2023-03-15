// @flow
import type { ExternalSaveHandler } from '../../../WidgetEnrollmentEventNew';
import { RenderFoundation } from '../../../../metaData';

export type Props = {|
    programId: string,
    stageId: string,
    orgUnitId: string,
    teiId: string,
    enrollmentId: string,
    dataEntryHasChanges: boolean,
    widgetReducerName: string,
    rulesExecutionDependencies: Object,
    onSave: ExternalSaveHandler,
    onCancel: () => void,
    categoryCombination?: ?{ position: string, form: RenderFoundation},
    ...CssClasses
|};
