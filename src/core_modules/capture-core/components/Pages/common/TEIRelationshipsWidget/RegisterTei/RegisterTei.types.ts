import type { WithStyles, StyleRules } from '@material-ui/core/styles';
import type { InputAttribute } from '../../../../DataEntries/EnrollmentRegistrationEntry/hooks/useFormValues';

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

export type StyleProps = {
    container: React.CSSProperties;
    leftContainer: React.CSSProperties;
};

export const getStyles = (): StyleRules<keyof StyleProps> => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    leftContainer: {
        flexGrow: 10,
        flexBasis: 0,
        margin: 8,
    },
});

export type ComponentProps = {
    selectedScopeId: string;
    error: string;
    dataEntryId: string;
    trackedEntityName: string | null;
    inheritedAttributes: Array<InputAttribute>;
    onSaveWithEnrollment: () => void;
    onSaveWithoutEnrollment: () => void;
} & SharedProps & WithStyles<typeof getStyles>;
