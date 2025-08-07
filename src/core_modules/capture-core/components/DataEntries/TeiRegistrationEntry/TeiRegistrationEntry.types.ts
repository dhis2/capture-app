import type { ReactNode } from 'react';
import type { RegistrationFormMetadata } from '../common/TEIAndEnrollment/useMetadataForRegistrationForm/types';
import type { RenderCustomCardActions } from '../../CardList';
import type { ExistingUniqueValueDialogActionsComponent } from '../withErrorMessagePostProcessor';
import type {
    TeiPayload,
} from '../../Pages/common/TEIRelationshipsWidget/RegisterTei/DataEntry/TrackedEntityInstance/dataEntryTrackedEntityInstance.types';
import type { InputAttribute } from '../EnrollmentRegistrationEntry/hooks/useFormValues';

export type OwnProps = {
    id: string;
    orgUnitId: string;
    selectedScopeId: string;
    saveButtonText: string;
    fieldOptions?: any;
    onSave: (payload: TeiPayload) => void;
    onCancel: () => void;
    duplicatesReviewPageSize: number;
    isSavingInProgress?: boolean;
    inheritedAttributes?: Array<InputAttribute>;
    renderDuplicatesCardActions?: RenderCustomCardActions;
    renderDuplicatesDialogActions?: (onCancel: () => void, onSave: (payload: TeiPayload) => void) => ReactNode;
    ExistingUniqueValueDialogActions: ExistingUniqueValueDialogActionsComponent;
};

type ContainerProps = {
    orgUnitId: string;
    teiRegistrationMetadata: RegistrationFormMetadata;
    ready: boolean;
    trackedEntityName: string;
    isUserInteractionInProgress: boolean;
};

export type Props = OwnProps & ContainerProps;

type PropsAddedInHOC = {
    onPostProcessErrorMessage: (message: string) => string;
    onSave: () => void;
};

type PropsRemovedInHOC = {
    renderDuplicatesCardActions?: RenderCustomCardActions;
    renderDuplicatesDialogActions?: (onCancel: () => void, onSave: (payload: TeiPayload) => void) => ReactNode;
    duplicatesReviewPageSize: number;
    onSave: (payload: TeiPayload) => void;
};

export type PlainProps = Omit<Props, keyof PropsRemovedInHOC> & PropsAddedInHOC;
