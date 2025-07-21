import type { ErrorData } from '../../../D2Form/FormBuilder';
import type { QuerySingleResource } from '../../../../utils/api/api.types';
import type { ExistingUniqueValueDialogActionsComponent } from './existingTeiContents.types';

export type Props = {
    programId?: string | null;
    errorData?: ErrorData;
    querySingleResource: QuerySingleResource;
    ExistingUniqueValueDialogActions: ExistingUniqueValueDialogActionsComponent;
    onCancel: () => void;
};

export type State = {
    ready: boolean;
    tetAttributesOnly: boolean;
    attributeValues?: { [id: string]: any } | null;
    teiId?: string | null;
};
