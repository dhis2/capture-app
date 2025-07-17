export type Props = {
    onAbort: () => void;
    onSave: () => void;
    warnings?: Array<{key: string, name?: string | null, warning: string}> | null;
    isCompleting: boolean;
    validationStrategy: string;
};
