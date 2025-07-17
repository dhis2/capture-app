export type Props = {
    onAbort: () => void;
    onSave: () => void;
    errors: Array<{key: string, name?: string | null, error: string}>;
    warnings: Array<{key: string, name?: string | null, warning: string}>;
    isCompleting: boolean;
    validationStrategy: string;
    saveEnabled: boolean;
};
