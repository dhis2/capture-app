import type { ErrorData } from '../../../D2Form/FormBuilder';
import type { ExistingUniqueValueDialogActionsComponent } from './existingTeiContents.types';

export type Props = {
    ExistingUniqueValueDialogActions: ExistingUniqueValueDialogActionsComponent;
    errorData?: ErrorData;
    trackedEntityTypeName: string;
    attributeName: string;
};

export type State = {
    existingTeiDialogOpen: boolean;
};
