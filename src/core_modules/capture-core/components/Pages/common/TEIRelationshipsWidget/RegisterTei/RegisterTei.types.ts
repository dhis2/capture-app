import type { InputAttribute } from '../../../../DataEntries/EnrollmentRegistrationEntry/hooks/useFormValues';

export type CardListButtonProps = {
    teiId: string;
    values: Record<string, any>;
    handleOnClick: (teiId: string, values: Record<string, any>) => void;
};

export type DialogButtonsProps = {
    onCancel: () => void;
    onSave: () => void;
    trackedEntityName: string | null;
};

export type SharedProps = {
    onLink: (teiId: string, values: Record<string, any>) => void;
    onGetUnsavedAttributeValues?: (() => void) | null;
    trackedEntityTypeId: string;
    onCancel: () => void;
};

export type ContainerProps = {
    suggestedProgramId: string;
    teiId: string;
    onSave: (teiPayload: Record<string, any>) => void;
} & SharedProps;

export type ComponentPropsPlain = {
    selectedScopeId: string;
    error: string;
    dataEntryId: string;
    trackedEntityName: string | null;
    inheritedAttributes: Array<InputAttribute>;
    onSaveWithEnrollment: (teiPayload: Record<string, any>) => void;
    onSaveWithoutEnrollment: (teiPayload: Record<string, any>) => void;
} & SharedProps;
