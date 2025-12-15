import type { ExternalSaveHandler } from '../../../WidgetEnrollmentEventNew';

export type Props = {
    programId: string;
    stageId: string;
    orgUnitId: string;
    teiId: string;
    enrollmentId: string;
    dataEntryHasChanges: boolean;
    widgetReducerName: string;
    rulesExecutionDependencies: Record<string, unknown>;
    onSave: ExternalSaveHandler;
    onCancel: () => void;
};

export type WrapperProps = {
    programId: string;
    stageId?: string;
    orgUnitId: string;
    teiId: string;
    enrollmentId: string;
    dataEntryHasChanges?: boolean;
    widgetReducerName?: string;
    rulesExecutionDependencies?: Record<string, unknown>;
    onSave?: ExternalSaveHandler;
    onCancel?: () => void;
};
