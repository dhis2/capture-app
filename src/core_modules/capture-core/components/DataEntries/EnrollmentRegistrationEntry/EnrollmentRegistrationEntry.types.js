// @flow
import type { Node } from 'react';
import type { RegistrationFormMetadata } from '../common/types';
import type { RenderCustomCardActions } from '../../CardList';
import type { SaveForDuplicateCheck } from '../common/TEIAndEnrollment/DuplicateCheckOnSave';
import type { ExistingUniqueValueDialogActionsComponent } from '../withErrorMessagePostProcessor';
import type { InputAttribute } from './hooks/useFormValues';

export type OwnProps = $ReadOnly<{|
  id: string,
  enrollmentMetadata: RegistrationFormMetadata,
  selectedScopeId: string,
  saveButtonText: string,
  fieldOptions?: Object,
  onSave: SaveForDuplicateCheck,
  duplicatesReviewPageSize: number,
  renderDuplicatesCardActions?: RenderCustomCardActions,
  renderDuplicatesDialogActions?: (onCancel: () => void, onSave: SaveForDuplicateCheck) => Node,
  ExistingUniqueValueDialogActions: ExistingUniqueValueDialogActionsComponent,
  teiId?: ?string,
  skipDuplicateCheck?: ?boolean,
  trackedEntityInstanceAttributes?: Array<InputAttribute>,
|}>;

type ContainerProps = {|
  ready: boolean,
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
    renderDuplicatesDialogActions?: (onCancel: () => void, onSave: SaveForDuplicateCheck,) => Node,
    duplicatesReviewPageSize: number,
    onSave: SaveForDuplicateCheck,
|};

export type PlainProps = {|
    ...$Diff<Props, PropsRemovedInHOC>,
    ...PropsAddedInHOC,
|};

