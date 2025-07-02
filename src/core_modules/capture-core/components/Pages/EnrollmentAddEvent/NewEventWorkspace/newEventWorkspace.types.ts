import type { ExternalSaveHandler } from '../../../WidgetEnrollmentEventNew';

type CssClasses = {
    classes: {
        [key: string]: string;
    };
};

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

export type PlainProps = Props & CssClasses;
