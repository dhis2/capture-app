import { type InputAttribute } from '../../../../DataEntries/EnrollmentRegistrationEntry/hooks/useFormValues';

export type SharedProps = {
    onLink: (teiId: string, values: Record<string, any>) => void;
    onGetUnsavedAttributeValues?: (() => any) | null;
    trackedEntityTypeId: string;
    onCancel: () => void;
};

export type ContainerProps = {
    suggestedProgramId: string;
    teiId: string;
    onSave: (teiPayload: Record<string, any>) => void;
} & SharedProps;

export type ComponentProps = {
    selectedScopeId: string;
    error: any;
    dataEntryId: string;
    trackedEntityName: string | null;
    inheritedAttributes: InputAttribute[];
    onSaveWithEnrollment: (teiPayload: Record<string, any>) => void;
    onSaveWithoutEnrollment: (teiPayload: Record<string, any>) => void;
} & SharedProps;
