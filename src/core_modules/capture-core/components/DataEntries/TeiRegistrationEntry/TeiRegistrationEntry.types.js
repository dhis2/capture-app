// @flow
import type { Node } from 'react';
import type { RegistrationFormMetadata } from '../common/TEIAndEnrollment/useMetadataForRegistrationForm/types';
import type { RenderCustomCardActions } from '../../CardList';
import type { SaveForDuplicateCheck } from '../common/TEIAndEnrollment/DuplicateCheckOnSave';
import type { ExistingUniqueValueDialogActionsComponent } from '../withErrorMessagePostProcessor';

export type OwnProps = $ReadOnly<{|
    id: string,
    selectedScopeId: string,
    saveButtonText: string,
    fieldOptions?: Object,
    onSave: SaveForDuplicateCheck,
    duplicatesReviewPageSize: number,
    isSavingInProgress?: boolean,
    renderDuplicatesCardActions?: RenderCustomCardActions,
    renderDuplicatesDialogActions?: (onCancel: () => void, onSave: SaveForDuplicateCheck) => Node,
    ExistingUniqueValueDialogActions: ExistingUniqueValueDialogActionsComponent,
|}>;

type ContainerProps = {|
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
    renderDuplicatesDialogActions?: (onCancel: () => void, onSave: SaveForDuplicateCheck) => Node,
    duplicatesReviewPageSize: number,
    onSave: SaveForDuplicateCheck,
|};

export type PlainProps = {|
    ...$Diff<Props, PropsRemovedInHOC>,
    ...PropsAddedInHOC,
|};

