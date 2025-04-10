import { type InputAttribute } from '../../../../DataEntries/EnrollmentRegistrationEntry/hooks/useFormValues';

type CssClasses = {
    classes: Record<string, any>;
};

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
    error: string;
    dataEntryId: string;
    trackedEntityName: string | null;
    inheritedAttributes: InputAttribute[];
    onSaveWithEnrollment: () => void;
    onSaveWithoutEnrollment: () => void;
} & SharedProps & CssClasses;
