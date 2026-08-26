import type { ReactNode } from 'react';
import type {
    ExistingUniqueValueDialogActionsComponent,
    SaveForEnrollmentAndTeiRegistration,
} from '../../../../../DataEntries';
import type { TeiPayload } from './TrackedEntityInstance/dataEntryTrackedEntityInstance.types';
import type { RenderCustomCardActions } from '../../../../../CardList';
import type { InputAttribute } from '../../../../../DataEntries/EnrollmentRegistrationEntry/hooks/useFormValues';
import type { SharedProps } from '../RegisterTei.types';

export type Props = {
    showDataEntry: boolean;
    programId: string;
    error?: string;
    onSaveWithoutEnrollment: (payload: TeiPayload) => void;
    onSaveWithEnrollment: SaveForEnrollmentAndTeiRegistration;
    inheritedAttributes: Array<InputAttribute>;
    duplicatesReviewPageSize: number;
    renderDuplicatesCardActions?: RenderCustomCardActions;
    renderDuplicatesDialogActions?: (onCancel: () => void, onSave: (payload: TeiPayload) => void) => ReactNode;
    ExistingUniqueValueDialogActions: ExistingUniqueValueDialogActionsComponent;
} & SharedProps;
