import type { InputAttribute } from '../../../../DataEntries/EnrollmentRegistrationEntry/hooks/useFormValues';

export type SharedProps = {
    onLink: (teiId: string, values: Record<string, any>) => void;
    onGetUnsavedAttributeValues?: ((args: any) => any) | undefined;
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
    error: string;
    dataEntryId: string;
    trackedEntityName: string | undefined;
    inheritedAttributes: Array<InputAttribute>;
    onSaveWithEnrollment: (teiPayload?: Record<string, any>) => void;
    onSaveWithoutEnrollment: (teiPayload?: Record<string, any>) => void;
} & SharedProps;
