// @flow
import type { Node } from 'react';
import type { RegistrationFormMetadata } from '../common/TEIAndEnrollment/useMetadataForRegistrationForm/types';
import type { RenderCustomCardActions } from '../../CardList';
import type { ExistingUniqueValueDialogActionsComponent } from '../withErrorMessagePostProcessor';
import type {
    TeiPayload,
} from '../../Pages/common/TEIRelationshipsWidget/RegisterTei/DataEntry/TrackedEntityInstance/dataEntryTrackedEntityInstance.types';
import type { InputAttribute } from '../EnrollmentRegistrationEntry/hooks/useFormValues';

export type OwnProps = $ReadOnly<{|
    id: string,
    orgUnitId: string,
    selectedScopeId: string,
    saveButtonText: string,
    fieldOptions?: Object,
    onSave: (TeiPayload) => void,
    onCancel: () => void,
    duplicatesReviewPageSize: number,
    isSavingInProgress?: boolean,
    inheritedAttributes?: Array<InputAttribute>,
    renderDuplicatesCardActions?: RenderCustomCardActions,
    renderDuplicatesDialogActions?: (onCancel: () => void, onSave: (TeiPayload) => void) => Node,
    ExistingUniqueValueDialogActions: ExistingUniqueValueDialogActionsComponent,
|}>;

type ContainerProps = {|
    orgUnitId: string,
    teiRegistrationMetadata: RegistrationFormMetadata,
    ready: boolean,
    trackedEntityName: string,
    isUserInteractionInProgress: boolean
|};

export type Props = $ReadOnly<{|
    ...OwnProps,
    ...ContainerProps
|}>;

type PropsAddedInHOC = {|
    onPostProcessErrorMessage: Function,
    ...CssClasses,
    onSave: (saveType?: ?string) => void,
|};
type PropsRemovedInHOC = {|
    renderDuplicatesCardActions?: RenderCustomCardActions,
    renderDuplicatesDialogActions?: (onCancel: () => void, onSave: (TeiPayload) => void) => Node,
    duplicatesReviewPageSize: number,
    onSave: (TeiPayload) => void,
|};

export type PlainProps = {|
    ...$Diff<Props, PropsRemovedInHOC>,
    ...PropsAddedInHOC,
|};

