import type { ReactNode } from 'react';
import type { Enrollment } from '../../../../../../../metaData';
import type { RenderCustomCardActions } from '../../../../../../CardList';
import type {
    SaveForEnrollmentAndTeiRegistration,
    ExistingUniqueValueDialogActionsComponent,
} from '../../../../../../DataEntries';
import type { InputAttribute } from '../../../../../../DataEntries/EnrollmentRegistrationEntry/hooks/useFormValues';

export type Props = {
    theme: any;
    programId: string;
    orgUnitId: string;
    inheritedAttributes: Array<InputAttribute>;
    enrollmentMetadata?: Enrollment;
    onSave: SaveForEnrollmentAndTeiRegistration;
    onCancel: () => void;
    duplicatesReviewPageSize: number;
    renderDuplicatesCardActions?: RenderCustomCardActions;
    renderDuplicatesDialogActions?: (onCancel: () => void, onSave: SaveForEnrollmentAndTeiRegistration) => ReactNode;
    ExistingUniqueValueDialogActions: ExistingUniqueValueDialogActionsComponent;
};
