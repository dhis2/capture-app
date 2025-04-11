import type { WithStyles } from '@material-ui/core/styles';
import type { InputAttribute } from '../../../../DataEntries/EnrollmentRegistrationEntry/hooks/useFormValues';
import { getStyles } from './RegisterTei.component';

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

export type ComponentProps = {
    selectedScopeId: string;
    error: string;
    dataEntryId: string;
    trackedEntityName: string | null;
    inheritedAttributes: Array<InputAttribute>;
    onSaveWithEnrollment: (teiPayload: Record<string, any>) => void;
    onSaveWithoutEnrollment: (teiPayload: Record<string, any>) => void;
} & SharedProps & WithStyles<typeof getStyles>;
