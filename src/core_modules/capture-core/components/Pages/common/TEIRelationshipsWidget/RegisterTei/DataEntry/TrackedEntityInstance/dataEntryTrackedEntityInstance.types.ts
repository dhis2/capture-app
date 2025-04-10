import { type InputAttribute } from '../../../../../../DataEntries/EnrollmentRegistrationEntry/hooks/useFormValues';

export const dataEntryTrackedEntityInstanceTypes = {
    LOADING: 'loading',
    READY: 'ready',
    ERROR: 'error',
};

export type DataEntryTrackedEntityInstanceProps = {
    id: string;
    formFoundation: any;
    onSave: (teiPayload: Record<string, any>) => void;
    onCancel: () => void;
    onGetFormFoundation: () => any;
    onAddNote: (note: string) => void;
    onGetUnsavedAttributeValues?: (() => any) | null;
    trackedEntityName: string | null;
    inheritedAttributes?: InputAttribute[];
};
