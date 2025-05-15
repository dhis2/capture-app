export type Props = {
    hasChanges: boolean;
    onSchedule: () => void;
    onCancel: () => void;
    validation?: {
        error: boolean;
    };
    classes: {
        container: string;
        button: string;
    };
};
