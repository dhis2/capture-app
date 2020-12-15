// @flow
import type { RegistrationFormMetadata } from '../common/types';

export type OwnProps = $ReadOnly<{|
  id: string,
  teiRegistrationMetadata: RegistrationFormMetadata,
  selectedScopeId: string,
  saveButtonText: string,
  fieldOptions?: Object,
  onSave: () => void,
  onGetUnsavedAttributeValues: Function,
  onPostProcessErrorMessage: Function,
|}>

type ContainerProps = {|
  ready: boolean,
|}

export type Props = $ReadOnly<{|
  ...OwnProps,
  ...CssClasses,
  ...ContainerProps
|}>

