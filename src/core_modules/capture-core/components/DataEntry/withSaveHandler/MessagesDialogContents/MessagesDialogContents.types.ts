export type Props = {
    open: boolean;
    onAbort: () => void;
    onSave: () => void;
    errors?: Array<{key: string, name?: string | null, error: string}> | null;
    warnings?: Array<{key: string, name?: string | null, warning: string}> | null;
    isCompleting: boolean;
    validationStrategy: string;
};
