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
