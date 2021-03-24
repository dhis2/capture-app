// @flow
import type { Node } from 'react';
import type { RegistrationFormMetadata } from '../common/types';
import type { RenderCustomCardActions } from '../../CardList';

export type OwnProps = $ReadOnly<{|
  id: string,
  teiRegistrationMetadata: RegistrationFormMetadata,
  selectedScopeId: string,
  saveButtonText: string,
  fieldOptions?: Object,
  onSave: () => void,
  duplicatesReviewPageSize: number,
  renderDuplicatesCardActions?: RenderCustomCardActions,
  renderDuplicatesDialogActions?: (onCancel: () => void, onSave: () => void) => Node,
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
|};
type PropsRemovedInHOC = {|
    renderDuplicatesCardActions?: RenderCustomCardActions,
    renderDuplicatesDialogActions?: (onCancel: () => void, onSave: () => void) => Node,
    duplicatesReviewPageSize: number,
|};

export type PlainProps = $Diff<{|...Props, ...PropsAddedInHOC|}, PropsRemovedInHOC>;

