// @flow
import type { ExternalSaveHandler } from './common.types';

export type WidgetProps = {|
    programId: string,
    stageId: string,
    teiId: string,
    enrollmentId: string,
    orgUnitId: string,
    onSave?: ExternalSaveHandler,
    onSaveSuccessActionType?: string,
    onSaveErrorActionType?: string,
    onCancel?: () => void,
    widgetReducerName: string
|};
