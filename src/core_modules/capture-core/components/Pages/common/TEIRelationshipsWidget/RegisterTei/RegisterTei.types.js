// @flow
import type { InputAttribute } from '../../../../DataEntries/EnrollmentRegistrationEntry/hooks/useFormValues';

export type SharedProps = {|
    onLink: (teiId: string, values: Object) => void,
    onGetUnsavedAttributeValues?: ?Function,
    trackedEntityTypeId: string,
|};

export type ContainerProps = {|
    suggestedProgramId: string,
    teiId: string,
    onSave: (teiPayload: Object) => void,
    ...SharedProps,
|};

export type ComponentProps = {|
    selectedScopeId: string,
    error: string,
    dataEntryId: string,
    trackedEntityName: ?string,
    originTeiId: ?string,
    inheritedAttributes: Array<InputAttribute>,
    onSaveWithEnrollment: () => void,
    onSaveWithoutEnrollment: () => void,
    ...SharedProps,
    ...CssClasses,
|};
