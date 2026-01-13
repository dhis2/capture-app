import type { InputAttribute } from '../../../../DataEntries/EnrollmentRegistrationEntry/hooks/useFormValues';

export type SharedProps = {
    onLink: (teiId: string, values: any) => void;
    onGetUnsavedAttributeValues?: () => void;
    trackedEntityTypeId: string;
    onCancel: () => void;
};

export type ContainerProps = {
    suggestedProgramId: string;
    teiId: string;
    onSave: (teiPayload: any) => void;
} & SharedProps;

export type ComponentProps = {
    selectedScopeId: string;
    error: string;
    dataEntryId: string;
    trackedEntityName?: string;
    inheritedAttributes: Array<InputAttribute>;
    isLoadingAttributes: boolean;
    onSaveWithEnrollment: () => void;
    onSaveWithoutEnrollment: () => void;
} & SharedProps;
