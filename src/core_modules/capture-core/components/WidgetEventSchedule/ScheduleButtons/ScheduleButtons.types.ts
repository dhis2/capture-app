export type PlainProps = {
    hasChanges: boolean;
    onSchedule: () => void;
    onCancel: () => void;
    validation?: {
        error: boolean;
        validationText: string;
    };
};
